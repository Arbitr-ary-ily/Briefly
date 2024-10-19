import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getSummary } from '@/lib/geminiAI';

const Storyboard = ({ articles }) => {
  const [combinedContent, setCombinedContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [uuid, setUuid] = useState('');

  useEffect(() => {
    const generateCombinedContent = async () => {
      const articlesText = articles.map(a => `${a.title}\n${a.description}`).join('\n\n');
      const summary = await getSummary(articlesText);
      setCombinedContent(summary);
    };

    generateCombinedContent();
  }, [articles]);

  const handlePublish = () => {
    const newUuid = uuidv4();
    setUuid(newUuid);
    setIsPublished(true);
    
    // Save to local storage
    const storyboard = { uuid: newUuid, content: combinedContent, articles };
    const savedStoryboards = JSON.parse(localStorage.getItem('storyboards') || '[]');
    savedStoryboards.push(storyboard);
    localStorage.setItem('storyboards', JSON.stringify(savedStoryboards));
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Storyboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selected Articles:</h3>
          <ul className="list-disc pl-5">
            {articles.map((article, index) => (
              <li key={index}>{article.title}</li>
            ))}
          </ul>
        </div>
        <Textarea
          value={combinedContent}
          onChange={(e) => setCombinedContent(e.target.value)}
          rows={10}
          className="w-full mb-4"
        />
        {!isPublished ? (
          <Button onClick={handlePublish}>Publish Storyboard</Button>
        ) : (
          <div>
            <p className="text-green-600 mb-2">Published! UUID: {uuid}</p>
            <Button onClick={() => setIsPublished(false)}>Edit</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Storyboard;