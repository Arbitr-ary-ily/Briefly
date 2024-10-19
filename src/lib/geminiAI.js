// lib/geminiAI.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getSummary(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Please provide a concise summary of the following text in about 2-3 sentences:

    ${text}

    Summary:
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating summary with Gemini AI:", error);
    throw error;
  }
}

export async function combineArticles(articles) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const articlesText = articles.map(a => `Title: ${a.title}\nDescription: ${a.description}`).join('\n\n');

  const prompt = `
    Combine the following articles into a coherent and comprehensive story:

    ${articlesText}

    Please provide a well-structured article that:
    1. Synthesizes the main points from all the input articles
    2. Maintains a neutral tone
    3. Provides additional context where necessary
    4. Highlights any conflicting information or perspectives
    5. Concludes with a summary of the key takeaways

    Format the article using these guidelines:
    - Use proper markdown formatting
    - Create clear paragraph breaks between ideas
    - Use bold text for emphasis on key points or names
    - Use headings (##) for main sections
    - Include a bulleted list for key takeaways at the end

    Article:
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Extract the text from the response structure
    const combinedText = response.candidates[0].content.parts[0].text;
    
    // Parse the markdown to ensure proper formatting
    const parsedText = parseMarkdown(combinedText);
    
    return parsedText;
  } catch (error) {
    console.error("Error combining articles with Gemini AI:", error);
    throw error;
  }
}

export async function generateDescription(content) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Generate a brief, engaging description for a storyboard based on the following content. 
    The description should be about 2-3 sentences long and capture the essence of the story:

    ${content}

    Description:
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating description with Gemini AI:", error);
    return "An engaging story awaits. Click to read more!"; // Fallback description
  }
}

function parseMarkdown(text) {
  // This function can be expanded to handle more complex markdown parsing if needed
  return text
    .replace(/\n\n/g, '<br><br>') // Convert double line breaks to HTML breaks
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** to <strong> tags
    .replace(/^## (.*$)/gm, '<h2>$1</h2>') // Convert ## headings to <h2> tags
    .replace(/^- (.*$)/gm, '<li>$1</li>') // Convert - list items to <li> tags
    .replace(/<li>.*?<\/li>/gs, match => `<ul>${match}</ul>`); // Wrap list items in <ul> tags
}
