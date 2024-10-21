"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ArticleSelector from '@/components/ArticleSelector';

const CreateVideo = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState(null);

  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
  };

  const handleCreateVideo = async () => {
    if (!selectedArticle) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/video-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: selectedArticle }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const videoBlob = await response.blob();
      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(videoUrl);
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <ArticleSelector onSelect={handleArticleSelect} selectedArticle={selectedArticle} />
      <Button 
        onClick={handleCreateVideo} 
        disabled={!selectedArticle || isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Video
          </>
        ) : (
          'Create Video'
        )}
      </Button>
      {generatedVideoUrl && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Generated Video:</h2>
          <video src={generatedVideoUrl} controls className="w-full" />
        </div>
      )}
    </div>
  );
};

export default CreateVideo;