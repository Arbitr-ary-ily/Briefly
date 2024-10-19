import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

export default function PublicStoryComponent({ story }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-foreground mb-4">{story.title}</h1>
        <p className="text-muted-foreground mb-6">
          By: {story.user_name} | Published on {new Date(story.published_at).toLocaleDateString()}
        </p>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {story.content.map((section, index) => (
            <div key={section.id || index} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          ))}
          
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Source Articles</h3>
            {story.source_articles.map((article, index) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-2 inline-block">
                    Read original article
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  )
}
