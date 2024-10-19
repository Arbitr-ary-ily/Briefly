import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const SavedArticles = () => {
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const articles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    setSavedArticles(articles);
  }, []);

  const removeArticle = (url) => {
    const updatedArticles = savedArticles.filter(article => article.url !== url);
    setSavedArticles(updatedArticles);
    localStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Saved Articles</h1>
        {savedArticles.length === 0 ? (
          <p className="text-center text-gray-500">No saved articles found.</p>
        ) : (
          <ScrollArea className="max-h-[80vh]">
            {savedArticles.map((article) => (
              <Card key={article.url} className="mb-4 shadow-lg transition-transform transform">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{article.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <Button asChild size="sm">
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        Read More
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => removeArticle(article.url)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove Article</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove Article</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        )}
      </div>
    </TooltipProvider>
  );
};

export default SavedArticles;
