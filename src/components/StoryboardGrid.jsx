"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookOpen, Loader2 } from 'lucide-react';
import { generateDescription } from '@/lib/geminiAI';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

export function StoryboardGrid({ storyboards }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {storyboards.map((storyboard, index) => (
        <motion.div
          key={storyboard.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <StoryboardCard storyboard={storyboard} />
        </motion.div>
      ))}
    </div>
  );
}

function StoryboardCard({ storyboard }) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDescription() {
      try {
        const generatedDescription = await generateDescription(storyboard.content);
        setDescription(generatedDescription);
      } catch (error) {
        console.error("Error generating description:", error);
        setDescription("Unable to load description.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDescription();
  }, [storyboard.content]);

  return (
    <MotionCard className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{storyboard.title}</CardTitle>
          <Badge className="ml-2">{storyboard.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <p className="text-muted-foreground line-clamp-3">{description}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="flex items-center space-x-4 text-muted-foreground text-sm">
          <span className="flex items-center space-x-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(storyboard.published_at).toLocaleDateString()}</span>
          </span>
        </div>
        <Link href={`/story/${storyboard.slug}`} className="w-full">
          <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md transition-colors flex items-center justify-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Read More</span>
          </button>
        </Link>
      </CardFooter>
    </MotionCard>
  );
}

export default StoryboardGrid;