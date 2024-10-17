// // pages/api/ai-expansion.js
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(API_KEY);

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { text } = req.body;

//     try {
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const prompt = `
//         Given the following article excerpt, please provide an expanded version that:
//         1. Adds context and background information
//         2. Explores potential implications or consequences
//         3. Presents different perspectives on the topic (if applicable)
//         4. Suggests related topics for further reading

//         Article excerpt:
//         ${text}

//         Expanded version (aim for about 2-3 paragraphs):
//       `;

//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       const expansion = response.text();

//       res.status(200).json({ expansion });
//     } catch (error) {
//       console.error('Error generating AI expansion:', error);
//       res.status(500).json({ error: 'Failed to generate AI expansion' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  const { text } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Given the following article excerpt, please provide an expanded version that:
      1. Adds context and background information
      2. Explores potential implications or consequences
      3. Presents different perspectives on the topic (if applicable)
      4. Suggests related topics for further reading

      Article excerpt:
      ${text}

      Expanded version (aim for about 2-3 paragraphs):
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const expansion = response.text();

    return new Response(JSON.stringify({ expansion }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating AI expansion:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate AI expansion' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}