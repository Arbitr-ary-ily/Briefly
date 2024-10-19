import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

export function SearchBar() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="text" placeholder="Search storyboards..." />
      <Button type="submit">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
