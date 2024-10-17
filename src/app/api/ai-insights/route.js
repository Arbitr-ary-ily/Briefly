// // pages/api/ai-insights.js
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // const API_KEY = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// export async function POST(req) {
//   const { searchTerm, articles } = await req.json();

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//       Analyze the following search term and article titles related to it:

//       Search Term: ${searchTerm}

//       Article Titles:
//       ${articles.map(article => `- ${article.title}`).join('\n')}

//       Please provide insights on the following:
//       1. Main themes or topics emerging from these articles
//       2. Any notable trends or patterns
//       3. Potential biases or perspectives represented
//       4. Suggestions for further exploration on this topic

//       Provide your analysis in a concise, bullet-point format.
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const insights = response.text();

//     return new Response(JSON.stringify({ insights }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error generating AI insights:', error);
//     return new Response(JSON.stringify({ error: 'Failed to generate AI insights' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// pages/api/ai-insights.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  const { searchTerm, articles } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following news articles related to "${searchTerm}":

      ${articles.map((article, index) => `
        Article ${index + 1}:
        Title: ${article.title}
        Description: ${article.description}
      `).join('\n\n')}

      Please provide a structured analysis in JSON format with the following keys:
      1. summary: A concise summary (max 100 words) of the key points
      2. themes: An array of key themes or topics emerging from these articles
      3. trends: An array of notable trends or patterns
      4. suggestions: An array of brief suggestions for further exploration
      5. risks: An array of potential risks
      6. opportunities: An array of potential opportunities
      7. recommendations: An array of recommendations for readers

      Ensure all arrays contain at least 2-3 items each.
      
      Return ONLY the JSON object, with no additional text before or after.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let insights;
    try {
      insights = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      insights = {
        error: "Failed to parse AI response",
        rawResponse: text
      };
    }

    return new Response(JSON.stringify({ insights }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate AI insights' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}