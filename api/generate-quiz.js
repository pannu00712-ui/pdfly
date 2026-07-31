const { chatCompletion, checkAndConsumeBudget, validateText, isAllowedOrigin } = require('./_deepseek');

const ALLOWED_COUNTS = new Set([5, 10, 15, 20]);

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

  const { text, numQuestions } = req.body || {};
  const textErr = validateText(text, 'text');
  if (textErr) return res.status(400).json({ error: 'bad_request', message: textErr });

  const count = Number(numQuestions);
  if (!ALLOWED_COUNTS.has(count)) {
    return res.status(400).json({ error: 'bad_request', message: 'numQuestions must be one of 5, 10, 15, or 20.' });
  }

  try {
    const quiz = await chatCompletion([
      {
        role: 'system',
        content: 'You write clear multiple-choice quizzes based only on the content of the provided document. Do not invent facts not present in the source text. For each question, list the question, four answer options labeled A-D, and clearly mark the correct answer at the end of that question. Output plain text only, no markdown formatting.',
      },
      { role: 'user', content: `Create a ${count}-question multiple-choice quiz based on the following document:\n\n${text}` },
    ], { maxTokens: 1800 });

    return res.status(200).json({ quiz });
  } catch (e) {
    console.error('[api/generate-quiz]', e.message);
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
