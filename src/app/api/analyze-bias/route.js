import { GoogleGenerativeAI } from "@google/generative-ai";

// Expanded keyword lists for more nuanced analysis
const leftKeywords = [
  "progressive", "liberal", "social justice", "equality", "regulation", "welfare", "collectivism",
  "workers' rights", "environmental protection", "universal healthcare", "wealth redistribution",
  "gun control", "pro-choice", "climate change action", "LGBTQ+ rights", "defund the police"
];
const rightKeywords = [
  "conservative", "traditional", "free market", "individual responsibility", "deregulation",
  "small government", "nationalism", "pro-life", "second amendment rights", "tax cuts",
  "strong military", "law and order", "border security", "school choice", "religious freedom"
];

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Helper function to parse Gemini's response
function parseGeminiResponse(text) {
  try {
    // First, try to parse the entire response as JSON
    return JSON.parse(text);
  } catch (error) {
    // If that fails, try to extract JSON from the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        console.error("Error parsing extracted JSON:", innerError);
      }
    }
    
    // If JSON extraction fails, fallback to manual parsing
    const ratingMatch = text.match(/Rating:\s*([-\d.]+)/);
    const explanationMatch = text.match(/Explanation:\s*([\s\S]+?)(?=\n\n|$)/);
    
    return {
      rating: ratingMatch ? parseFloat(ratingMatch[1]) : 0,
      explanation: explanationMatch ? explanationMatch[1].trim() : "No explanation provided.",
      keyPhrases: []  // We'll skip key phrases in this fallback scenario
    };
  }
}

// Named export for the POST method
export async function POST(req) {
  const { text, title } = await req.json();

  if (!text || !title) {
    return new Response(JSON.stringify({ message: 'Both text and title are required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the political bias of the following news article title and summary. Provide a comprehensive analysis with the following elements:

      Title: "${title}"
      Summary: "${text}"

      1. Bias Rating: Rate the bias on a scale from -1 to 1 (-1 being extremely left-biased, 0 being neutral, 1 being extremely right-biased).

      2. Detailed Explanation: Provide a comprehensive explanation for your rating, including specific examples from the text.

      3. Key Phrases: Identify up to 5 key phrases or words that indicate bias, explaining each in detail.

      4. Balanced Perspective: Suggest how the article could be rewritten to be more balanced, providing specific examples.

      5. Confidence Level: Rate your confidence in the analysis on a scale of 1-10, explaining any uncertainties.

      6. Emotion Analysis: Identify the primary emotions conveyed in the text and explain how they contribute to bias.

      7. Fact vs Opinion: Highlight statements that are presented as facts but may be opinions, and explain why.

      8. Source Credibility: Comment on the credibility of any sources mentioned or implied, and how this affects the bias.

      9. Historical Context: Provide relevant historical context that might influence the interpretation of the text.

      10. Ideological Alignment: Suggest which political ideologies or parties might align with the article's perspective, explaining why.

      11. Language Analysis: Analyze the use of language (e.g., loaded terms, euphemisms, metaphors) and how it contributes to bias.

      12. Comparative Analysis: Compare this article's bias to typical reporting on this topic, explaining any differences.

      13. Media Literacy Tips: Provide 3-5 media literacy tips specific to this article to help readers critically evaluate it.

      Provide your response in the following JSON format:

      {
        "rating": [number],
        "explanation": [string],
        "keyPhrases": [{ "phrase": [string], "explanation": [string] }],
        "balancedPerspective": [string],
        "confidenceLevel": [number],
        "confidenceExplanation": [string],
        "emotionAnalysis": [string],
        "factVsOpinion": [string],
        "sourceCredibility": [string],
        "historicalContext": [string],
        "ideologicalAlignment": [string],
        "languageAnalysis": [string],
        "comparativeAnalysis": [string],
        "mediaLiteracyTips": [array of strings]
      }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const geminiAnalysis = parseGeminiResponse(response.text());

    // Perform keyword analysis (remains the same)
    const fullText = `${title} ${text}`.toLowerCase();
    const leftCount = leftKeywords.filter(keyword => fullText.includes(keyword)).length;
    const rightCount = rightKeywords.filter(keyword => fullText.includes(keyword)).length;
    const keywordBias = (rightCount - leftCount) / Math.max(leftKeywords.length, rightKeywords.length);

    // Combine Gemini rating and keyword analysis
    const finalRating = (geminiAnalysis.rating * 0.8 + keywordBias * 0.2).toFixed(2);

    // Determine bias category
    let biasCategory;
    if (finalRating <= -0.75) biasCategory = "Extremely Left-Leaning";
    else if (finalRating <= -0.5) biasCategory = "Strongly Left-Leaning";
    else if (finalRating <= -0.25) biasCategory = "Moderately Left-Leaning";
    else if (finalRating < 0.25) biasCategory = "Relatively Neutral";
    else if (finalRating < 0.5) biasCategory = "Moderately Right-Leaning";
    else if (finalRating < 0.75) biasCategory = "Strongly Right-Leaning";
    else biasCategory = "Extremely Right-Leaning";

    return new Response(JSON.stringify({ 
      title,
      summary: text,
      rating: parseFloat(finalRating), 
      category: biasCategory,
      ...geminiAnalysis
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error analyzing bias:', error);
    return new Response(JSON.stringify({ message: 'Error analyzing bias', error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(req) {
  return new Response(JSON.stringify({ message: 'Method not allowed' }), { 
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}
