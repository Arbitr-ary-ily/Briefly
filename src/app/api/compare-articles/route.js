import { GoogleGenerativeAI } from "@google/generative-ai";
import { parse } from 'node-html-parser';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  const { article1, article2 } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Ensure the model name is correct

    const prompt = `
      Compare and analyze the following two articles:

      Article 1: "${article1.title}"
      ${article1.content}

      Article 2: "${article2.title}"
      ${article2.content}

      Please provide a detailed comparison and analysis, including:
      1. Main themes and topics of each article
      2. Similarities and differences in content and perspective
      3. Potential biases or slants in each article
      4. Credibility and use of sources (if applicable)
      5. Writing style and tone comparison
      6. Overall impact and significance of each article

      Format your response using the following HTML structure:
      <div class="comparison-result" style="padding: 16px; background-color: white; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border-radius: 8px;">
        <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Article Comparison Analysis</h2>
        
        <section class="themes" style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: semi-bold; margin-bottom: 8px;">Main Themes and Topics</h3>
          <div class="article-comparison" style="display: grid; grid-template-columns: 1fr; gap: 16px;">
            <div class="article1" style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
              <h4 style="font-size: 18px; font-weight: medium;">Article 1: ${article1.title}</h4>
              <ul style="list-style-type: disc; padding-left: 20px; margin-top: 8px;">
                <li>[Theme 1]</li>
                <li>[Theme 2]</li>
                ...
              </ul>
            </div>
            <div class="article2" style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
              <h4 style="font-size: 18px; font-weight: medium;">Article 2: ${article2.title}</h4>
              <ul style="list-style-type: disc; padding-left: 20px; margin-top: 8px;">
                <li>[Theme 1]</li>
                <li>[Theme 2]</li>
                ...
              </ul>
            </div>
          </div>
        </section>

        <section class="similarities-differences" style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: semi-bold; margin-bottom: 8px;">Similarities and Differences</h3>
          <h4 style="font-weight: medium;">Similarities</h4>
          <ul style="list-style-type: disc; padding-left: 20px; margin-top: 8px;">
            <li>[Similarity 1]</li>
            <li>[Similarity 2]</li>
            ...
          </ul>
          <h4 style="font-weight: medium; margin-top: 16px;">Differences</h4>
          <ul style="list-style-type: disc; padding-left: 20px; margin-top: 8px;">
            <li>[Difference 1]</li>
            <li>[Difference 2]</li>
            ...
          </ul>
        </section>

        <section class="bias-analysis" style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: semi-bold; margin-bottom: 8px;">Bias Analysis</h3>
          <div class="article-comparison" style="display: grid; grid-template-columns: 1fr; gap: 16px;">
            <div class="article1" style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
              <h4 style="font-size: 18px; font-weight: medium;">Article 1</h4>
              <p>[Bias analysis for Article 1]</p>
            </div>
            <div class="article2" style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
              <h4 style="font-size: 18px; font-weight: medium;">Article 2</h4>
              <p>[Bias analysis for Article 2]</p>
            </div>
          </div>
        </section>

        <section class="credibility" style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: semi-bold; margin-bottom: 8px;">Credibility and Sources</h3>
          <div class="article-comparison" style="display: grid; grid-template-columns: 1fr; gap: 16px;">
            <div class="article1" style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
              <h4 style="font-size: 18px; font-weight: medium;">Article 1</h4>
              <p>[Credibility analysis for Article 1]</p>
            </div>
            <div class="article2" style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
              <h4 style="font-size: 18px; font-weight: medium;">Article 2</h4>
              <p>[Credibility analysis for Article 2]</p>
            </div>
          </div>
        </section>

        <section class="writing-style" style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: semi-bold; margin-bottom: 8px;">Writing Style and Tone</h3>
          <div class="article-comparison" style="display: grid; grid-template-columns: 1fr; gap: 16px;">
            <div class="article1" style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
              <h4 style="font-size: 18px; font-weight: medium;">Article 1</h4>
              <p>[Writing style and tone analysis for Article 1]</p>
            </div>
            <div class="article2" style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 4px;">
              <h4 style="font-size: 18px; font-weight: medium;">Article 2</h4>
              <p>[Writing style and tone analysis for Article 2]</p>
            </div>
          </div>
        </section>

        <section class="impact" style="margin-bottom: 24px;">
          <h3 style="font-size: 20px; font-weight: semi-bold; margin-bottom: 8px;">Overall Impact and Significance</h3>
          <p>[Analysis of the overall impact and significance of both articles]</p>
        </section>
      </div>
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Check if response is valid before accessing text
    if (!response || !response.text) {
      throw new Error('Invalid response from model'); // Handle invalid response
    }
    
    let comparison = await response.text(); // Await the text method to get the content

    // Post-process the HTML
    const root = parse(comparison);
    
    // Add classes for styling
    root.querySelectorAll('section').forEach(section => {
      section.classList.add('mb-6');
    });
    
    root.querySelectorAll('h3').forEach(h3 => {
      h3.classList.add('text-xl', 'font-semibold', 'mb-3');
    });
    
    root.querySelectorAll('h4').forEach(h4 => {
      h4.classList.add('text-lg', 'font-medium', 'mb-2');
    });
    
    root.querySelectorAll('ul').forEach(ul => {
      ul.classList.add('list-disc', 'pl-5', 'mb-3');
      // Add left indent to listed items
    });
    
    root.querySelectorAll('p').forEach(p => {
      p.classList.add('mb-2');
    });
    
    root.querySelectorAll('.article-comparison').forEach(comp => {
      comp.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4');
    });

    comparison = root.toString();

    return new Response(JSON.stringify({ comparison }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error comparing articles:', error);
    return new Response(JSON.stringify({ error: 'Failed to compare articles' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
