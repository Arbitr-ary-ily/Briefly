import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const ArticleSelector = ({ articles, onCreateStoryboard }) => {
  const [selectedArticles, setSelectedArticles] = useState([]);

  const toggleArticleSelection = (article) => {
    setSelectedArticles(prev => 
      prev.some(a => a.url === article.url)
        ? prev.filter(a => a.url !== article.url)
        : [...prev, article]
    );
  };

  const handleCreateStoryboard = () => {
    if (selectedArticles.length > 0) {
      onCreateStoryboard(selectedArticles);
      setSelectedArticles([]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Articles for Storyboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Card key={article.url} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedArticles.some(a => a.url === article.url)}
                  onCheckedChange={() => toggleArticleSelection(article)}
                />
                <CardTitle className="text-sm">{article.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs">{article.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button 
        onClick={handleCreateStoryboard} 
        className="mt-4"
        disabled={selectedArticles.length === 0}
      >
        Create Storyboard
      </Button>
    </div>
  );
};

export default ArticleSelector;