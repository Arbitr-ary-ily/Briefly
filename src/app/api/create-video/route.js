import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  const { articles } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Create a video script based on the following news articles:

      ${articles.map((article, index) => `
        Article ${index + 1}:
        Title: ${article.title}
        Description: ${article.description}
      `).join('\n\n')}

      Please provide a script that:
      1. Summarizes the key points from all articles
      2. Creates a coherent narrative
      3. Suggests visuals and transitions
      4. Is suitable for a 2-3 minute video

      Format the script as follows:
      [SCENE 1]
      Narration: ...
      Visuals: ...

      [SCENE 2]
      Narration: ...
      Visuals: ...

      ...and so on.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const script = response.text();

    // Here you would typically send this script to your video creation API
    // For now, we'll just return the script
    return NextResponse.json({ script });
  } catch (error) {
    console.error('Error creating video script:', error);
    return NextResponse.json({ error: 'Failed to create video script' }, { status: 500 });
  }
}

