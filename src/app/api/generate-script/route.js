import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_TWO);

export async function POST(req) {
  const { article } = await req.json();
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a short video script based on the following article:
    Title: ${article.title}
    Description: ${article.description}
    
    The script should be concise, engaging, and suitable for a 1-2 minute video.`;

    const result = await model.generateContent(prompt);
    const script = result.response.text();

    return new Response(JSON.stringify({ script }), { status: 200 });
  } catch (error) {
    console.error('Error generating script:', error);
    return new Response(JSON.stringify({ error: 'Error generating script' }), { status: 500 });
  }
}

// ... other HTTP methods can be added here if needed
