import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { StoryboardGrid } from '@/components/StoryboardGrid';
import { SearchBar } from '@/components/SearchBar';
import Image from 'next/image';
export default async function StoriesPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: storyboards, error } = await supabase
    .from('storyboards')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching storyboards:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
              <Image src="/logo.svg" alt="Logo" width={275} height={50} className="mb-8" />
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Explore Storyboards</h1>
                <SearchBar />
              </div>
      <StoryboardGrid storyboards={storyboards || []} />
    </div>
  );
}