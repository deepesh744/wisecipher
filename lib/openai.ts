// Handles OpenAI API requests with streaming support

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

// Security: Never expose OPENAI_API_KEY to frontend

export async function getOpenAISummary(prompt: string, text: string) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text }
      ],
      max_tokens: 800,
      temperature: 0.4,
    }),
  });
  return await res.json();
}
