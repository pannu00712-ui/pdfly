const MAX_CHARS = 12000; // keep prompt sizes sane / cheap
const MAX_TEXT_BYTES = 2 * 1024 * 1024; // 2MB of extracted text is already a lot

function getDocumentText(body) {
  const { text } = body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw httpError(400, 'No document text received. Please re-upload the PDF.');
  }
  if (Buffer.byteLength(text, 'utf8') > MAX_TEXT_BYTES) {
    throw httpError(413, 'Document text is too large.');
  }
  return text.trim().slice(0, MAX_CHARS);
}

async function callDeepSeek(messages) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw httpError(500, 'Server is not configured (missing API key).');

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    console.error('DeepSeek API error:', res.status, errText);
    throw httpError(502, 'AI service request failed. Please try again.');
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw httpError(502, 'AI service returned an empty response.');
  return content;
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function withHandler(req, res, fn) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const result = await fn(req.body || {});
    return res.status(200).json(result);
  } catch (err) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    return res.status(status).json({ error: err.message || 'Something went wrong.' });
  }
}

module.exports = { getDocumentText, callDeepSeek, withHandler };
