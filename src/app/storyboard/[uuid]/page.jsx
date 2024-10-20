"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { combineArticles } from '@/lib/geminiAI'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Share2, FileText, Sparkles, Plus, GripVertical, X } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import RichTextEditor from "@/components/RichTextEditor"
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { trackEvent } from '@/lib/analytics';
import { useUser } from "@clerk/nextjs";

export default function AdvancedStoryboardEditor() {
  const { uuid } = useParams()
  const [title, setTitle] = useState('Untitled Storyboard')
  const [sections, setSections] = useState([{ id: 1, title: 'Introduction', content: '' }])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [publishDate, setPublishDate] = useState(null)
  const [selectedArticles, setSelectedArticles] = useState([])
  const router = useRouter()
  const { user } = useUser();

  useEffect(() => {
    const savedStoryboard = JSON.parse(localStorage.getItem(`storyboard-${uuid}`)) || { title: 'Untitled Storyboard', sections: [] }
    
    setTitle(savedStoryboard.title);
    
    // Ensure sections is always an array
    const initialSections = Array.isArray(savedStoryboard.sections) && savedStoryboard.sections.length > 0 
      ? savedStoryboard.sections 
      : [{ id: 1, title: 'Introduction', content: '' }];
    
    setSections(initialSections);
    
    // Load selected articles from local storage
    const storedArticles = JSON.parse(localStorage.getItem('selectedArticles')) || [];
    setSelectedArticles(storedArticles);

    const generateContent = async () => {
      if (storedArticles.length > 0 && (!sections[0] || !sections[0].content)) {
        setLoading(true)
        try {
          const combinedContent = await combineArticles(storedArticles)
          setSections(prevSections => [
            { ...prevSections[0], content: combinedContent },
            ...prevSections.slice(1)
          ])
        } catch (error) {
          console.error("Error generating content:", error)
          toast({
            title: "Error",
            description: "Failed to generate content. Please try again.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
    }
    generateContent()
  }, [uuid])

  useEffect(() => {
    localStorage.setItem(`storyboard-${uuid}`, JSON.stringify({ title, sections, articles }))
  }, [uuid, title, sections, articles])

  const handlePublish = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/publish-storyboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: JSON.stringify(sections),
          sourceArticles: JSON.stringify(selectedArticles),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish storyboard');
      }
      

      const { slug } = await response.json();
      setPublishDate(new Date().toLocaleString());
      toast({
        title: "Published",
        description: "Your story has been published successfully.",
      });
      
      // Redirect to the public story page
      router.push(`/story/${slug}`);
      // Track the event after successful publication
      await trackEvent(user.id, 'storyboard_created', { title, sectionCount: sections.length });
    } catch (error) {
      console.error('Error publishing story:', error);
      toast({
        title: "Error",
        description: "Failed to publish story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "The storyboard link has been copied to your clipboard.",
    })
  }

  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: 'New Section', content: '' }])
  }

  const updateSectionTitle = (id, newTitle) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, title: newTitle } : section
    ))
  }

  const updateSectionContent = (id, newContent) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, content: newContent } : section
    ))
  }

  const deleteSection = (id) => {
    setSections(sections.filter(section => section.id !== id))
  }

  // Add this function to handle adding articles to a section
  const addArticleToSection = async (article) => {
    setLoading(true)
    try {
      const updatedArticles = [...selectedArticles, article]
      const combinedContent = await combineArticles(updatedArticles)
      setSections(prevSections => [
        { ...prevSections[0], content: combinedContent },
        ...prevSections.slice(1)
      ])
      setSelectedArticles(updatedArticles)
      localStorage.setItem('selectedArticles', JSON.stringify(updatedArticles))
    } catch (error) {
      console.error("Error adding article to section:", error)
      toast({
        title: "Error",
        description: "Failed to add article to section. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-card/50 backdrop-blur-sm border-b"
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 mb-4"
            placeholder="Enter storyboard title..."
          />
          <div className="flex space-x-3">
            <Button onClick={handlePublish} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Publishing...' : 'Publish'}
            </Button>
            <Button onClick={handleCopyLink} variant="outline" size="lg" className="text-foreground">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={addSection} variant="outline" size="lg" className="text-foreground ml-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </motion.div>
        <ScrollArea className="flex-1 p-6">
          <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-6">
            {sections.map((section) => (
              <Reorder.Item key={section.id} value={section} className="cursor-move">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-4">
                        <GripVertical className="w-5 h-5 text-muted-foreground mr-2" />
                        <Input
                          value={section.title}
                          onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                          className="text-xl font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Button variant="ghost" size="sm" onClick={() => deleteSection(section.id)} className="ml-auto">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <RichTextEditor
                        initialContent={section.content}
                        onContentChange={(content) => updateSectionContent(section.id, content)}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </ScrollArea>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-1/3 flex flex-col overflow-hidden bg-card/30 backdrop-blur-sm border-l"
      >
        <div className="p-6 bg-background/50 border-b">
          <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-primary" />
            Source Articles
          </h2>
        </div>
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {selectedArticles.length > 0 ? (
              selectedArticles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Card className="bg-card hover:bg-card/90 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">Article {index + 1}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <GripVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => addArticleToSection(article)}>Add to Section</DropdownMenuItem>
                            <DropdownMenuItem>Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h3 className="text-lg font-medium text-card-foreground mb-2">{article.title}</h3>
                      <p className="text-sm text-card-foreground/80">{article.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No articles available.</p>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  )
}
