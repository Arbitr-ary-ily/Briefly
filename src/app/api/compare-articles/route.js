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
      <div class="comparison-result">
        <h2>Article Comparison Analysis</h2>
        
        <section class="themes">
          <h3>Main Themes and Topics</h3>
          <div class="article-comparison">
            <div class="article1">
              <h4>Article 1: ${article1.title}</h4>
              <ul style="margin-left: 20px;"> <!-- Added margin left for listed items -->
                <li>[Theme 1]</li>
                <li>[Theme 2]</li>
                ...
              </ul>
            </div>
            <div class="article2">
              <h4>Article 2: ${article2.title}</h4>
              <ul style="margin-left: 20px;"> <!-- Added margin left for listed items -->
                <li>[Theme 1]</li>
                <li>[Theme 2]</li>
                ...
              </ul>
            </div>
          </div>
        </section>

        <section class="similarities-differences">
          <h3>Similarities and Differences</h3>
          <h4>Similarities</h4>
          <ul style="margin-left: 20px;"> <!-- Added margin left for listed items -->
            <li>[Similarity 1]</li>
            <li>[Similarity 2]</li>
            ...
          </ul>
          <h4>Differences</h4>
          <ul style="margin-left: 20px;"> <!-- Added margin left for listed items -->
            <li>[Difference 1]</li>
            <li>[Difference 2]</li>
            ...
          </ul>
        </section>

        <section class="bias-analysis">
          <h3>Bias Analysis</h3>
          <div class="article-comparison">
            <div class="article1">
              <h4>Article 1</h4>
              <p>[Bias analysis for Article 1]</p>
            </div>
            <div class="article2">
              <h4>Article 2</h4>
              <p>[Bias analysis for Article 2]</p>
            </div>
          </div>
        </section>

        <section class="credibility">
          <h3>Credibility and Sources</h3>
          <div class="article-comparison">
            <div class="article1">
              <h4>Article 1</h4>
              <p>[Credibility analysis for Article 1]</p>
            </div>
            <div class="article2">
              <h4>Article 2</h4>
              <p>[Credibility analysis for Article 2]</p>
            </div>
          </div>
        </section>

        <section class="writing-style">
          <h3>Writing Style and Tone</h3>
          <div class="article-comparison">
            <div class="article1">
              <h4>Article 1</h4>
              <p>[Writing style and tone analysis for Article 1]</p>
            </div>
            <div class="article2">
              <h4>Article 2</h4>
              <p>[Writing style and tone analysis for Article 2]</p>
            </div>
          </div>
        </section>

        <section class="impact">
          <h3>Overall Impact and Significance</h3>
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
