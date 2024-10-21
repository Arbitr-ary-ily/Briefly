import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request) {
  const { url } = await request.json();

  // Validate the URL
  try {
    new URL(url); // This will throw if the URL is invalid
  } catch {
    return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
  }

  try {
    // Fetch the content of the article
    const response = await fetch(url);
    const html = await response.text();

    // Extract text content from HTML (you might want to use a proper HTML parser for better results)
    const textContent = html.replace(/<[^>]*>/g, '');

    // Use Gemini to analyze the article
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze the following news article and provide a brief summary, key points, and potential biases:

${textContent.substring(0, 5000)} // Limit text to 5000 characters

Summary:
Key Points:
Potential Biases:`;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing news article:', error);
    return NextResponse.json({ error: 'Failed to analyze the article' }, { status: 500 });
  }
}
