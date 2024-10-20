import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

const ArticleSelector = ({ onSelect, selectedArticle }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news?q=' + searchTerm);
      const data = await response.json();
      setArticles(data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select an Article</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={fetchArticles}>Search</Button>
        </div>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            {articles.map((article) => (
              <div
                key={article.url}
                className={`p-2 cursor-pointer rounded-md hover:bg-gray-100 ${
                  selectedArticle?.url === article.url ? 'bg-yellow-100' : ''
                }`}
                onClick={() => onSelect(article)}
              >
                <h3 className="font-semibold">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.description}</p>
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleSelector;
