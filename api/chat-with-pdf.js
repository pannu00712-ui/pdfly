const { chatCompletion, checkAndConsumeBudget, validateText, isAllowedOrigin, MAX_QUESTION_CHARS } = require('./_deepseek');

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

  const { text, question, history } = req.body || {};

  const textErr = validateText(text, 'text');
  if (textErr) return res.status(400).json({ error: 'bad_request', message: textErr });

  if (typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'bad_request', message: 'Missing or empty required field: question' });
  }
  if (question.length > MAX_QUESTION_CHARS) {
    return res.status(400).json({ error: 'bad_request', message: `question is too long (max ${MAX_QUESTION_CHARS} characters).` });
  }

  const safeHistory = Array.isArray(history)
    ? history.slice(-6).filter(m => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant')).map(m => ({ role: m.role, content: m.content.slice(0, 2000) }))
    : [];

  try {
    const answer = await chatCompletion([
      { role: 'system', content: 'You answer questions using only the content of the provided document. If the answer is not in the document, say so plainly instead of guessing. Be concise.' },
      { role: 'user', content: `Document:\n\n${text}` },
      ...safeHistory,
      { role: 'user', content: question },
    ], { maxTokens: 700 });

    return res.status(200).json({ answer });
  } catch (e) {
    console.error('[api/chat-with-pdf]', e.message);
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
