import React from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const StoryboardSidebar = ({ selectedArticles, onArticleSelect, onClose }) => {
  const router = useRouter();

  const handleCreateStoryboard = () => {
    const uuid = uuidv4();
    localStorage.setItem(`storyboard-${uuid}`, JSON.stringify(selectedArticles));
    router.push(`/storyboard/${uuid}`);
  };

  return (
    <motion.div
      initial={{ x: '-100%' }} // Start off-screen
      animate={{ x: 0 }} // Slide in
      exit={{ x: '-100%' }} // Slide out
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Selected Articles</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {selectedArticles.length > 0 ? (
        selectedArticles.map((article) => (
          <div key={article.url} className="mb-2 p-2 bg-gray-100 rounded">
            <p className="text-sm font-semibold">{article.title}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No articles selected.</p>
      )}
      <Button
        onClick={handleCreateStoryboard}
        className="mt-4 w-full"
        disabled={selectedArticles.length === 0}
      >
        Create Storyboard
      </Button>
    </motion.div>
  );
};

export default StoryboardSidebar;
