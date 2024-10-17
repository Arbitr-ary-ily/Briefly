import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  const { term } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Given the search term "${term}", generate 3 related search suggestions that users might be interested in.
      Provide the results as a comma-separated list.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text().split(',').map(item => item.trim());

    return new Response(JSON.stringify({ suggestions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating search suggestions:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate search suggestions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}