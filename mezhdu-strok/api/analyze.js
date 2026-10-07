// Vercel serverless function: POST /api/analyze
// Два последовательных вызова: промпт 1 (анализ) → промпт 2 (критик). Ответ — JSON по схеме.
import Anthropic from '@anthropic-ai/sdk';
import {
  ENABLE_SAME_REASON, QUESTIONS, PROMPT_2_JSON, buildPrompt1, formatAnswers, resultSchema,
} from '../prompts.js';

export const config = { maxDuration: 300 };

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';
const MAX_IMAGES = 4;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const client = new Anthropic(); // ключ из ANTHROPIC_API_KEY

const request = (messages) => ({
  model: MODEL,
  max_tokens: 16000,
  thinking: { type: 'adaptive' },
  output_config: {
    effort: 'high',
    format: { type: 'json_schema', schema: resultSchema(ENABLE_SAME_REASON) },
  },
  betas: ['server-side-fallback-2026-07-01'],
  fallbacks: 'default',
  messages,
});

async function run(messages) {
  const message = await client.beta.messages.stream(request(messages)).finalMessage();
  if (message.stop_reason === 'refusal') throw Object.assign(new Error('refusal'), { status: 422 });
  if (message.stop_reason === 'max_tokens') throw Object.assign(new Error('max_tokens'), { status: 502 });
  const text = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  return { message, result: JSON.parse(text) };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const { answers = {}, images = [] } = req.body || {};
  const known = Object.fromEntries(QUESTIONS.map((q) => [q.id, String(answers[q.id] || '').slice(0, 4000)]));
  const answersText = formatAnswers(known);
  const imageBlocks = (Array.isArray(images) ? images : [])
    .filter((img) => img && IMAGE_TYPES.has(img.type) && typeof img.data === 'string')
    .slice(0, MAX_IMAGES)
    .map((img) => ({ type: 'image', source: { type: 'base64', media_type: img.type, data: img.data } }));

  if (!answersText && !imageBlocks.length) return res.status(400).json({ error: 'empty' });

  const userContent = [
    ...imageBlocks,
    { type: 'text', text: buildPrompt1(answersText || '(только скриншоты)', 'json') },
  ];

  try {
    const first = await run([{ role: 'user', content: userContent }]);
    const final = await run([
      { role: 'user', content: userContent },
      { role: 'assistant', content: first.message.content },
      { role: 'user', content: PROMPT_2_JSON },
    ]);
    return res.status(200).json({ result: final.result, draft: first.result });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'rate_limit' });
    if (error instanceof Anthropic.AuthenticationError) return res.status(500).json({ error: 'auth' });
    if (error instanceof Anthropic.BadRequestError) return res.status(400).json({ error: 'bad_request', detail: error.message });
    if (error instanceof Anthropic.APIError) return res.status(502).json({ error: 'upstream', detail: error.message });
    if (error instanceof SyntaxError) return res.status(502).json({ error: 'bad_json' });
    return res.status(error.status || 500).json({ error: error.message || 'unknown' });
  }
}
