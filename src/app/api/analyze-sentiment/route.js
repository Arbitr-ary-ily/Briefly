import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_TWO);

export async function POST(req) {
  const { text } = await req.json();

  if (!text) {
    return new Response(JSON.stringify({ message: 'Text is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log('Analyzing sentiment with Gemini AI:', { text }); // Log the request
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the sentiment of the following text and provide a sentiment score and explanation:
      
      Text: "${text}"
      
      Response format:
      {
        "sentiment": [string], // e.g., "positive", "negative", "neutral"
        "icon": [string] // Lucide React icon name: "Smile" for positive, "Frown" for negative, "Meh" for neutral
      }
    `;

    const result = await model.generateContent(prompt);
    const geminiResponse = result.response;
    const parsedResponse = JSON.parse(geminiResponse.text());

    return new Response(JSON.stringify(parsedResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error analyzing sentiment:', error.response ? error.response.data : error.message);
    return new Response(JSON.stringify({ message: 'Error analyzing sentiment', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}