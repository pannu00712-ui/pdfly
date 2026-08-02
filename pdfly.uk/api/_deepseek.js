/**
 * Shared Google Gemini helper for Vercel Serverless Functions (/api/*.js).
 * Key is read ONLY from process.env.GEMINI_API_KEY (set it in your Vercel
 * project's Environment Variables — never hardcode it here).
 *
 * Free tier: Google AI Studio (aistudio.google.com) issues a free Gemini API
 * key with a generous daily request quota — no billing required to start.
 */

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';

// Hard caps so one request can't run away with cost/latency.
const MAX_INPUT_CHARS = 40000; // ~10k tokens of source text
const MAX_QUESTION_CHARS = 2000;

const ALLOWED_ORIGINS = new Set([
  'https://pdfly.uk',
  'https://www.pdfly.uk',
]);

/** Best-effort guard against direct/external abuse of the API (not airtight —
 * Origin/Referer can be spoofed by non-browser clients — but it stops casual
 * scraping and cross-site usage of the free quota. Allows same-origin
 * requests and requests with no Origin header (e.g. curl during local dev). */
function isAllowedOrigin(req) {
  const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : null);
  if (!origin) return true; // no Origin header (server-to-server, curl) — allow, rely on rate budget instead
  return ALLOWED_ORIGINS.has(origin) || origin.endsWith('.vercel.app');
}

function getApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw Object.assign(new Error('Server is not configured (missing GEMINI_API_KEY).'), { code: 'CONFIG' });
  return key;
}

/**
 * Accepts the same OpenAI-style `messages` array used elsewhere in this
 * codebase ([{ role: 'system'|'user'|'assistant', content: string }, ...])
 * and translates it into Gemini's `contents` + `systemInstruction` format.
 */
function toGeminiPayload(messages) {
  const systemParts = [];
  const contents = [];
  for (const m of messages) {
    if (!m || typeof m.content !== 'string') continue;
    if (m.role === 'system') {
      systemParts.push({ text: m.content });
    } else {
      // Gemini uses "model" instead of "assistant" for the AI's turns.
      contents.push({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] });
    }
  }
  return { contents, systemInstruction: systemParts.length ? { parts: systemParts } : undefined };
}

/** Low-level call shared by text (chatCompletion) and vision (ocrImages)
 * requests: handles the fetch, the one-shot 429 retry, and error shaping.
 * `payload` is the full Gemini `generateContent` request body. */
async function callGemini(payload) {
  const url = `${GEMINI_BASE_URL}/models/${MODEL}:generateContent?key=${getApiKey()}`;
  const body = JSON.stringify(payload);
  const attempt = async () => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });

  let res = await attempt();

  // One short retry on 429 — smooths over transient per-minute bursts.
  // Does NOT help once the daily quota is genuinely exhausted, but those
  // cases fail fast on the second try too, so the extra latency is small.
  if (res.status === 429) {
    await new Promise(r => setTimeout(r, 1500));
    res = await attempt();
  }

  if (!res.ok) {
    const rawBody = await res.text().catch(() => '');
    const err = new Error(`Gemini API error ${res.status}: ${rawBody}`);
    err.status = res.status;
    if (res.status === 429) {
      err.isDailyQuota = /free_tier_requests|PerDay|RPD/i.test(rawBody);
    }
    throw err;
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') ?? '';
}

async function chatCompletion(messages, opts = {}) {
  const { contents, systemInstruction } = toGeminiPayload(messages);
  return callGemini({
    contents,
    ...(systemInstruction ? { systemInstruction } : {}),
    generationConfig: {
      maxOutputTokens: opts.maxTokens ?? 900,
      temperature: opts.temperature ?? 0.3,
    },
  });
}

// Hard caps for OCR image requests — keeps the request well under Vercel's
// serverless body-size limit and bounds cost/latency per request.
const MAX_OCR_IMAGES = 6;
const MAX_OCR_TOTAL_BASE64_CHARS = 3_000_000; // ~2.2MB of binary image data, safely under Vercel's request body limit

function validateImages(images) {
  if (!Array.isArray(images) || images.length === 0) return 'No pages to process.';
  if (images.length > MAX_OCR_IMAGES) return `Too many pages (max ${MAX_OCR_IMAGES} per request).`;
  let total = 0;
  for (const img of images) {
    if (!img || typeof img.data !== 'string' || !img.data || typeof img.mimeType !== 'string') {
      return 'Malformed image data.';
    }
    if (!/^image\/(jpeg|png|webp)$/.test(img.mimeType)) return 'Unsupported image type.';
    total += img.data.length;
  }
  if (total > MAX_OCR_TOTAL_BASE64_CHARS) return 'PDF pages are too large/high-resolution to process. Try a shorter document.';
  return null;
}

/** OCRs a set of page images (base64-encoded, no data: prefix) with Gemini's
 * vision input and returns the transcribed plain text. */
async function ocrImages(images, opts = {}) {
  const parts = images.map(img => ({ inlineData: { mimeType: img.mimeType, data: img.data } }));
  parts.push({ text: 'Extract all readable text from these document page images, in reading order. Preserve paragraph breaks. Output only the extracted text — no commentary, no page-number labels, no markdown formatting.' });
  return callGemini({
    contents: [{ role: 'user', parts }],
    systemInstruction: { parts: [{ text: 'You are an OCR engine. Transcribe text from images exactly as written, preserving structure. If a page has no readable text, skip it silently.' }] },
    generationConfig: {
      maxOutputTokens: opts.maxTokens ?? 4000,
      temperature: 0,
    },
  });
}

/** Very rough best-effort global daily budget. Persists only within a warm
 * serverless instance (resets on cold start / across regions) — good enough
 * to blunt accidental runaway loops, NOT a substitute for a real store.
 * For real cross-instance quota tracking, back this with Vercel KV / Upstash
 * Redis instead (swap the two functions below, keep the call sites the same). */
let _budget = { date: null, used: 0 };
const GLOBAL_DAILY_BUDGET = Number(process.env.GEMINI_GLOBAL_DAILY_BUDGET || 500);

function checkAndConsumeBudget() {
  const today = new Date().toISOString().slice(0, 10);
  if (_budget.date !== today) _budget = { date: today, used: 0 };
  if (_budget.used >= GLOBAL_DAILY_BUDGET) return false;
  _budget.used += 1;
  return true;
}

function validateText(text, fieldName = 'text') {
  if (typeof text !== 'string' || !text.trim()) return `Missing or empty required field: ${fieldName}`;
  if (text.length > MAX_INPUT_CHARS) return `${fieldName} is too long (max ${MAX_INPUT_CHARS} characters). Try a shorter document.`;
  return null;
}

module.exports = {
  chatCompletion,
  checkAndConsumeBudget,
  validateText,
  isAllowedOrigin,
  MAX_INPUT_CHARS,
  MAX_QUESTION_CHARS,
  ocrImages,
  validateImages,
  MAX_OCR_IMAGES,
};
