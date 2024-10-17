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

    const prompt = `Analyze the political bias of the following news article title and summary. Provide a comprehensive analysis with the following elements:

    Title: "${title}"
    Summary: "${text}"

    1. Bias Rating: Rate the bias on a scale from -1 to 1 (-1 being extremely left-biased, 0 being neutral, 1 being extremely right-biased).

    2. Detailed Explanation: Provide a comprehensive explanation for your rating.

    3. Key Phrases: Identify up to 5 key phrases or words that indicate bias, explaining each.

    4. Balanced Perspective: Suggest how the article could be rewritten to be more balanced.

    5. Confidence Level: Rate your confidence in the analysis on a scale of 1-10, explaining any uncertainties.

    6. Emotion Analysis: Identify the primary emotions conveyed in the text (e.g., fear, hope, anger, etc.).

    7. Fact vs Opinion: Highlight statements that are presented as facts but may be opinions.

    8. Source Credibility: Comment on the credibility of any sources mentioned or implied.

    9. Historical Context: Provide any relevant historical context that might influence the interpretation of the text.

    10. Ideological Alignment: Suggest which political ideologies or parties might align with the article's perspective.

    11. Key Topics Table: Create a table of key topics mentioned in the article, their frequency, and potential bias implications.

    12. Language Complexity: Analyze the complexity of the language used and how it might influence reader perception.

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
      "keyTopicsTable": [{ "topic": [string], "frequency": [number], "biasImplication": [string] }],
      "languageComplexity": [string]
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


// import { GoogleGenerativeAI } from "@google/generative-ai";

// const leftKeywords = [
//   "progressive", "liberal", "social justice", "equality", "regulation", "welfare", "collectivism",
//   "workers' rights", "environmental protection", "universal healthcare", "wealth redistribution",
//   "gun control", "pro-choice", "climate change action", "LGBTQ+ rights", "defund the police"
// ];
// const rightKeywords = [
//   "conservative", "traditional", "free market", "individual responsibility", "deregulation",
//   "small government", "nationalism", "pro-life", "second amendment rights", "tax cuts",
//   "strong military", "law and order", "border security", "school choice", "religious freedom"
// ];

// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// function parseGeminiResponse(text) {
//   try {
//     return JSON.parse(text);
//   } catch (error) {
//     console.error("Error parsing Gemini response:", error);
//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       try {
//         return JSON.parse(jsonMatch[0]);
//       } catch (innerError) {
//         console.error("Error parsing extracted JSON:", innerError);
//       }
//     }
    
//     const ratingMatch = text.match(/Rating:\s*([-\d.]+)/);
//     const explanationMatch = text.match(/Explanation:\s*([\s\S]+?)(?=\n\n|$)/);
    
//     return {
//       rating: ratingMatch ? parseFloat(ratingMatch[1]) : 0,
//       explanation: explanationMatch ? explanationMatch[1].trim() : "No explanation provided.",
//       keyPhrases: []
//     };
//   }
// }

// async function analyzeBiasWithHuggingFace(text) {
//   try {
//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/d4data/bias-detection-model",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ inputs: text }), // Ensure the body is formatted correctly
//       }
//     );
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
    
//     const result = await response.json();
    
//     if (!Array.isArray(result) || result.length === 0) {
//       return { label: 'unbiased', score: 0 }; // Default response
//     }
    
//     return result[0];
//   } catch (error) {
//     console.error("Error in Hugging Face API call:", error);
//     return { label: 'unbiased', score: 0 }; // Default response
//   }
// }

// export async function POST(req) {
//   const { text, title } = await req.json();

//   if (!text || !title) {
//     return new Response(JSON.stringify({ message: 'Both text and title are required' }), { 
//       status: 400,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//     const prompt = `Analyze the political bias of the following news article title and summary. Provide a comprehensive analysis with the following elements:

//     Title: "${title}"
//     Summary: "${text}"

//     1. Bias Rating: Rate the bias on a scale from -1 to 1 (-1 being extremely left-biased, 0 being neutral, 1 being extremely right-biased).

//     2. Detailed Explanation: Provide a comprehensive explanation for your rating.

//     3. Key Phrases: Identify up to 5 key phrases or words that indicate bias, explaining each.

//     4. Balanced Perspective: Suggest how the article could be rewritten to be more balanced.

//     5. Confidence Level: Rate your confidence in the analysis on a scale of 1-10, explaining any uncertainties.

//     6. Emotion Analysis: Identify the primary emotions conveyed in the text (e.g., fear, hope, anger, etc.).

//     7. Fact vs Opinion: Highlight statements that are presented as facts but may be opinions.

//     8. Source Credibility: Comment on the credibility of any sources mentioned or implied.

//     9. Historical Context: Provide any relevant historical context that might influence the interpretation of the text.

//     10. Ideological Alignment: Suggest which political ideologies or parties might align with the article's perspective.

//     11. Key Topics Table: Create a table of key topics mentioned in the article, their frequency, and potential bias implications.

//     12. Language Complexity: Analyze the complexity of the language used and how it might influence reader perception.

//     Provide your response in the following JSON format:

//     {
//       "rating": [number],
//       "explanation": [string],
//       "keyPhrases": [{ "phrase": [string], "explanation": [string] }],
//       "balancedPerspective": [string],
//       "confidenceLevel": [number],
//       "confidenceExplanation": [string],
//       "emotionAnalysis": [string],
//       "factVsOpinion": [string],
//       "sourceCredibility": [string],
//       "historicalContext": [string],
//       "ideologicalAlignment": [string],
//       "keyTopicsTable": [{ "topic": [string], "frequency": [number], "biasImplication": [string] }],
//       "languageComplexity": [string]
//     }`;

//     const [geminiResult, huggingFaceResult] = await Promise.all([
//       model.generateContent(prompt).catch(error => {
//         console.error("Error in Gemini API call:", error);
//         return null;
//       }),
//       analyzeBiasWithHuggingFace(text)
//     ]);

//     let geminiAnalysis = null;
//     if (geminiResult && geminiResult.response) {
//       geminiAnalysis = parseGeminiResponse(geminiResult.response.text());
//     }
    
//     // Convert Hugging Face result to a number between -1 and 1
//     let huggingFaceBias = 0;
//     if (huggingFaceResult && huggingFaceResult.label) {
//       huggingFaceBias = huggingFaceResult.label === 'biased' 
//         ? (huggingFaceResult.score * 2) - 1  // Scale from 0-1 to -1 to 1
//         : 0;  // If 'unbiased', set to 0
//     }

//     // Perform keyword analysis
//     const fullText = `${title} ${text}`.toLowerCase();
//     const leftCount = leftKeywords.filter(keyword => fullText.includes(keyword)).length;
//     const rightCount = rightKeywords.filter(keyword => fullText.includes(keyword)).length;
//     const keywordBias = (rightCount - leftCount) / Math.max(leftKeywords.length, rightKeywords.length);

//     // Combine Gemini rating, Hugging Face result, and keyword analysis
//     const geminiRating = geminiAnalysis ? geminiAnalysis.rating : 0;
//     const finalRating = (
//       (geminiRating * 0.6) + 
//       (huggingFaceBias * 0.3) + 
//       (keywordBias * 0.1)
//     ).toFixed(2);

//     // Determine bias category
//     let biasCategory;
//     if (finalRating <= -0.75) biasCategory = "Extremely Left-Leaning";
//     else if (finalRating <= -0.5) biasCategory = "Strongly Left-Leaning";
//     else if (finalRating <= -0.25) biasCategory = "Moderately Left-Leaning";
//     else if (finalRating < 0.25) biasCategory = "Relatively Neutral";
//     else if (finalRating < 0.5) biasCategory = "Moderately Right-Leaning";
//     else if (finalRating < 0.75) biasCategory = "Strongly Right-Leaning";
//     else biasCategory = "Extremely Right-Leaning";

//     return new Response(JSON.stringify({ 
//       title,
//       summary: text,
//       rating: parseFloat(finalRating), 
//       category: biasCategory,
//       geminiAnalysis: geminiAnalysis,
//       huggingFaceAnalysis: huggingFaceResult ? {
//         label: huggingFaceResult.label,
//         score: huggingFaceResult.score
//       } : null,
//       keywordAnalysis: {
//         leftCount,
//         rightCount,
//         keywordBias
//       }
//     }), { 
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   } catch (error) {
//     console.error('Error analyzing bias:', error);
//     return new Response(JSON.stringify({ message: 'Error analyzing bias', error: error.message }), { 
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }

// export async function GET(req) {
//   return new Response(JSON.stringify({ message: 'Method not allowed' }), { 
//     status: 405,
//     headers: { 'Content-Type': 'application/json' }
//   });
// }
