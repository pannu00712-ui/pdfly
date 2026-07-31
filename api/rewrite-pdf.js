const { chatCompletion, checkAndConsumeBudget, validateText, isAllowedOrigin } = require('./_deepseek');

const ALLOWED_TONES = new Set(['professional', 'simple', 'formal', 'casual']);
const ALLOWED_LENGTHS = new Set(['same', 'shorter', 'longer']);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: 'forbidden_origin' });
  }

  if (!checkAndConsumeBudget()) {
    return res.status(503).json({ error: 'ai_capacity_reached', message: 'AI features have reached their shared daily capacity. Please try again tomorrow.' });
  }

  const { text, tone, length } = req.body || {};
  const textErr = validateText(text, 'text');
  if (textErr) return res.status(400).json({ error: 'bad_request', message: textErr });

  const safeTone = ALLOWED_TONES.has(tone) ? tone : 'professional';
  const safeLength = ALLOWED_LENGTHS.has(length) ? length : 'same';
  const lengthInstruction = {
    same: 'Keep the rewritten version roughly the same length as the original.',
    shorter: 'Make the rewritten version noticeably shorter and more concise than the original.',
    longer: 'Make the rewritten version more detailed and somewhat longer than the original.',
  }[safeLength];

  try {
    const rewritten = await chatCompletion([
      {
        role: 'system',
        content: `You paraphrase and rewrite text to improve clarity and readability, in a ${safeTone} tone. ${lengthInstruction} Preserve the original meaning and facts — do not invent new information. Output only the rewritten text, no commentary.`,
      },
      { role: 'user', content: `Rewrite the following text:\n\n${text}` },
    ], { maxTokens: 8000 });

    return res.status(200).json({ rewritten });
  } catch (e) {
    console.error('[api/rewrite-pdf]', e.message);
    if (e.code === 'CONFIG') return res.status(500).json({ error: 'server_misconfigured' });
    if (e.status === 429) {
      const msg = e.isDailyQuota
        ? 'The free AI quota for today has been used up. Please try again tomorrow, or the site owner can enable billing for higher limits.'
        : 'AI provider is busy right now. Please wait a moment and try again.';
      return res.status(503).json({ error: 'upstream_rate_limited', message: msg });
    }
    return res.status(502).json({ error: 'ai_upstream_error', message: 'AI processing failed. Please try again.' });
  }
};
