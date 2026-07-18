const { chatCompletion, checkAndConsumeBudget, validateText, isAllowedOrigin } = require('./_deepseek');

const ALLOWED_LANGS = new Set([
  'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian',
  'Chinese (Simplified)', 'Chinese (Traditional)', 'Japanese', 'Korean',
  'Arabic', 'Hindi', 'Urdu', 'Bengali', 'Turkish', 'Vietnamese', 'Thai',
  'Indonesian', 'Polish', 'Ukrainian', 'Greek', 'Hebrew', 'Swedish',
  'Norwegian', 'Danish', 'Finnish', 'Czech', 'Romanian', 'Hungarian', 'English',
]);

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

  const { text, targetLang } = req.body || {};
  const textErr = validateText(text, 'text');
  if (textErr) return res.status(400).json({ error: 'bad_request', message: textErr });

  if (typeof targetLang !== 'string' || !ALLOWED_LANGS.has(targetLang)) {
    return res.status(400).json({ error: 'bad_request', message: 'targetLang must be one of the supported languages.' });
  }

  try {
    const translation = await chatCompletion([
      { role: 'system', content: 'You translate text faithfully, preserving meaning, tone, and paragraph structure. Output only the translation, no commentary.' },
      { role: 'user', content: `Translate the following text to ${targetLang}:\n\n${text}` },
    ], { maxTokens: 1200 });

    return res.status(200).json({ translation });
  } catch (e) {
    console.error('[api/pdf-translator]', e.message);
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
