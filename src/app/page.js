'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Newspaper, Search } from "lucide-react";
import ArticleCard from './ArticleCard';

const NewsAggregator = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularArticles();
  }, []);

  const fetchPopularArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/popular-articles');
      setArticles(response.data);
    } catch (err) {
      setError('Failed to fetch popular articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      setArticles(response.data);
    } catch (err) {
      setError('Failed to fetch search results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold flex items-center">
          <Newspaper className="mr-2" />
          News Aggregator
        </h1>
        <div className="flex w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="mr-2" />
            Search
          </Button>
        </div>
      </header>

      <main>
        <h2 className="text-2xl font-semibold mb-4">
          {searchTerm ? 'Search Results' : 'Popular Articles'}
        </h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))}
            </div>
          </ScrollArea>
        )}
      </main>
    </div>
  );
};

export default NewsAggregator;