'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Share2, MessageCircle, ThumbsUp, Bookmark, Send } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

const yellowAccent = "bg-yellow-300"
const yellowAccentHover = "hover:bg-yellow-400"

export default function EnhancedStoryPage() {
  const { slug } = useParams()
  const { user } = useUser()
  const [story, setStory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/storyboard/${slug}`)
        if (!response.ok) throw new Error('Failed to fetch story')
        const data = await response.json()
        setStory(data)
        const commentsResponse = await fetch(`/api/storyboard/${slug}/comments`)
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json()
          setComments(commentsData)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStory()

    // Load comments from local storage
    const storedComments = localStorage.getItem(`comments_${slug}`)
    if (storedComments) {
      setComments(JSON.parse(storedComments))
    }
  }, [slug])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    // Add a toast notification here
  }

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        user: { name: user?.fullName || 'Anonymous', avatar: user?.profileImageUrl },
        content: newComment,
        createdAt: new Date().toISOString(),
      }
      const updatedComments = [...comments, newCommentObj]
      setComments(updatedComments)
      setNewComment('')

      // Save comments to local storage
      localStorage.setItem(`comments_${slug}`, JSON.stringify(updatedComments))
    }
  }

  if (isLoading) return <StoryPageSkeleton />
  if (error) return <div className="text-center text-red-500 mt-8">Error: {error}</div>
  if (!story) return <div className="text-center mt-8">Story not found</div>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-foreground mb-4"
        >
          {story.title}
        </motion.h1>
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            By: {user?.fullName || 'Anonymous'} | Published on {new Date(story.published_at).toLocaleDateString()}
          </p>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleShare} variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy link to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleLike} variant="outline" className={`${yellowAccent} ${yellowAccentHover}`}>
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like this story</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleBookmark} variant="outline" className={`${yellowAccent} ${yellowAccentHover}`}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmark
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save for later</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {story.content.map((section, index) => (
                <motion.div
                  key={section.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="mb-8 border border-foreground-muted">
                    <CardHeader>
                      <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Source Articles</h3>
                {story.source_articles.map((article, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{article.description}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline mt-2 inline-block">
                          Read original article
                        </a>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="lg:w-1/3">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-yellow-500" />
                  Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-400px)]">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={comment.user.avatar} />
                            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold">{comment.user.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <Separator className="my-4" />
                    </motion.div>
                  ))}
                </ScrollArea>
                <div className="mt-4">
                  <Textarea
                    placeholder="Add your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2"
                  />
                  <Button onClick={handleCommentSubmit} className={`w-full ${yellowAccent} ${yellowAccentHover}`}>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function StoryPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6">
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="mb-8 border border-foreground-muted">
                  <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-2" />
                    <Skeleton className="h-4 w-4/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="flex items-center mb-2">
                        <Skeleton className="h-8 w-8 rounded-full mr-2" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-20 w-full mt-4" />
                <Skeleton className="h-10 w-full mt-2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
