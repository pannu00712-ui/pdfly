const { chatCompletion, checkAndConsumeBudget, validateText, isAllowedOrigin } = require('./_deepseek');

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

  const { text } = req.body || {};
  const textErr = validateText(text, 'text');
  if (textErr) return res.status(400).json({ error: 'bad_request', message: textErr });

  try {
    const explanation = await chatCompletion([
      { role: 'system', content: 'You explain documents in plain, simple language for someone unfamiliar with the subject. Break down jargon, clarify structure, and summarize the key points in an easy-to-follow way. Do not invent facts not present in the source text.' },
      { role: 'user', content: `Explain the following document in plain language:\n\n${text}` },
    ], { maxTokens: 900 });

    return res.status(200).json({ explanation });
  } catch (e) {
    console.error('[api/explain-pdf]', e.message);
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
