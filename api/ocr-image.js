const { ocrImages, checkAndConsumeBudget, validateImages, isAllowedOrigin } = require('./_deepseek');

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

  const { image, mimeType } = req.body || {};
  const images = [{ data: image, mimeType }];
  const imgErr = validateImages(images);
  if (imgErr) return res.status(400).json({ error: 'bad_request', message: imgErr });

  try {
    const text = await ocrImages(images);
    return res.status(200).json({ text });
  } catch (e) {
    console.error('[api/ocr-image]', e.message);
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
