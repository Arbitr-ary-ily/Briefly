import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import Link from 'next/link';

const SavedArticles = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const articles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    setSavedArticles(articles);
  }, []);

  const removeArticle = (url) => {
    const updatedArticles = savedArticles.filter(article => article.url !== url);
    setSavedArticles(updatedArticles);
    localStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
  };

  const filteredArticles = savedArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/dashboard">
          <Image src="/logo.svg" alt="Logo" width={275} height={50} className="mb-8 mx-auto" />
        </Link>

        <h1 className="text-5xl font-bold mb-6 text-center text-gray-800">Saved Articles</h1>
        
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {filteredArticles.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No saved articles found.</p>
        ) : (
          <ScrollArea className="h-[calc(100vh-300px)]">
            {filteredArticles.map((article) => (
              <Card key={article.url} className="mb-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{article.description}</p>
                  <div className="flex justify-between items-center">
                    <Button asChild size="sm">
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        Read More
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeArticle(article.url)}
                          className="text-red-500 hover:bg-red-100 hover:text-red-600"
                        >
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