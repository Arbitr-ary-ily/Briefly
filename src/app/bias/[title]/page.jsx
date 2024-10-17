// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useState, useEffect } from 'react';

// const BiasAnalysisPage = () => {
//   const searchParams = useSearchParams();
//   const [biasAnalysis, setBiasAnalysis] = useState(null);

//   useEffect(() => {
//     const biasData = searchParams.get('biasData');
//     if (biasData) {
//       try {
//         setBiasAnalysis(JSON.parse(biasData));
//       } catch (error) {
//         console.error('Error parsing bias data:', error);
//       }
//     }
//   }, [searchParams]);

//   if (!biasAnalysis) return <div>Loading...</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Bias Analysis for "{decodeURIComponent(searchParams.get('title') || '')}"</h1>
//       <div className="bg-white shadow-md rounded p-6">
//         <p><strong>Rating:</strong> {biasAnalysis.rating.toFixed(2)}</p>
//         <p><strong>Category:</strong> {biasAnalysis.category}</p>
//         <h2 className="text-xl font-semibold mt-4 mb-2">Explanation</h2>
//         <p>{biasAnalysis.explanation}</p>
//         <h2 className="text-xl font-semibold mt-4 mb-2">Key Phrases</h2>
//         <ul className="list-disc pl-5">
//           {biasAnalysis.keyPhrases.map((item, index) => (
//             <li key={index}>
//               <strong>{item.phrase}</strong>: {item.explanation}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default BiasAnalysisPage;
"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress"; // Import the Progress component from Shadcn UI

const BiasAnalysisPage = () => {
  const searchParams = useSearchParams();
  const [biasAnalysis, setBiasAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const rating = searchParams.get('rating');
    const category = searchParams.get('category');
    const explanation = searchParams.get('explanation');
    const keyPhrases = searchParams.get('keyPhrases'); // Assuming keyPhrases is passed as a JSON string

    if (rating && category && explanation) {
      setBiasAnalysis({
        rating: parseFloat(rating),
        category,
        explanation,
        keyPhrases: keyPhrases ? JSON.parse(keyPhrases) : [], // Parse keyPhrases if available
      });
    } else {
      setError('No bias analysis data found.');
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Calculate the progress percentage based on the rating
  const progressPercentage = ((biasAnalysis.rating + 1) / 2) * 100; // Scale from -1 to 1 to 0 to 100

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bias Analysis for "{decodeURIComponent(searchParams.get('title') || '')}"</h1>
      <div className="bg-white shadow-md rounded p-6">
        <p><strong>Rating:</strong> {biasAnalysis.rating.toFixed(2)}</p>
        <p><strong>Category:</strong> {biasAnalysis.category}</p>
        <h2 className="text-xl font-semibold mt-4 mb-2">Explanation</h2>
        <p>{biasAnalysis.explanation}</p>
        
        {/* Progress Bar */}
        <h2 className="text-xl font-semibold mt-4 mb-2">Bias Rating Progress</h2>
        <Progress value={progressPercentage} className="h-4 rounded" />
        
        <h2 className="text-xl font-semibold mt-4 mb-2">Key Phrases</h2>
        {biasAnalysis.keyPhrases && biasAnalysis.keyPhrases.length > 0 ? (
          <ul className="list-disc pl-5">
            {biasAnalysis.keyPhrases.map((item, index) => (
              <li key={index}>
                <strong>{item.phrase}</strong>: {item.explanation}
              </li>
            ))}
          </ul>
        ) : (
          <p>No key phrases available.</p>
        )}
      </div>
    </div>
  );
};

export default BiasAnalysisPage;
