import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  const { topic } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Given the topic "${topic}", generate 3 trending and related subtopics or specific aspects that users might be interested in.
      Provide the results as a comma-separated list.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = response.text().split(',').map(item => item.trim());

    return new Response(JSON.stringify({ recommendations }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate recommendations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}