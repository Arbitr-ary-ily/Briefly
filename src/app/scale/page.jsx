"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import ArticleSelector from '@/components/ArticleSelector';

export default function ScalePage() {
  const [article1, setArticle1] = useState(null);
  const [article2, setArticle2] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedComparison = localStorage.getItem('articleComparison');
    if (savedComparison) {
      const { article1, article2, comparison } = JSON.parse(savedComparison);
      setArticle1(article1);
      setArticle2(article2);
      setComparison(comparison);
    }
  }, []);

  const handleCompare = async () => {
    // Clear previous comparison results when starting a new comparison
    setComparison(null);

    if (!article1 || !article2) {
      toast({
        title: "Incomplete Selection",
        description: "Please select two articles to compare.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/compare-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article1, article2 }),
      });

      if (!response.ok) throw new Error('Failed to compare articles');

      const result = await response.json();
      setComparison(result.comparison);

      localStorage.setItem('articleComparison', JSON.stringify({
        article1,
        article2,
        comparison: result.comparison,
      }));

      toast({
        title: "Comparison Complete",
        description: "The articles have been compared successfully.",
      });
    } catch (error) {
      console.error('Error comparing articles:', error);
      toast({
        title: "Error",
        description: "Failed to compare articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
        <Image src="/logo.svg" alt="Logo" className="mb-6 mt-6" width={275} height={100}></Image>
      <h1 className="text-3xl font-bold mb-6">Article Comparison Scale</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ArticleSelector onSelect={setArticle1} selectedArticle={article1} />
        <ArticleSelector onSelect={setArticle2} selectedArticle={article2} />
      </div>
      <Button onClick={handleCompare} disabled={isLoading} className="mt-6">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Compare Articles
      </Button>
      {comparison && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Comparison Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: comparison }} />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
