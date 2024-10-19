// "use client"

// import React, { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import axios from 'axios'
// import Link from 'next/link'
// import Image from 'next/image'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Mic, MessageCircle, ExternalLink, Share2, AlertTriangle, Scale, ChevronDown, ChevronUp, Info, Calendar, Save } from "lucide-react"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { useToast } from "@/hooks/use-toast"
// import { Progress } from "@/components/ui/progress"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Skeleton } from "@/components/ui/skeleton"

// const ArticleCard = ({ article }) => {
//   const [isExpanded, setIsExpanded] = useState(false)
//   const [isAIExpansionVisible, setIsAIExpansionVisible] = useState(false)
//   const [aiExpansion, setAiExpansion] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSpeaking, setIsSpeaking] = useState(false)
//   const [biasAnalysis, setBiasAnalysis] = useState(null)
//   const [isAnalyzingBias, setIsAnalyzingBias] = useState(false)
//   const [isBiasMeterVisible, setIsBiasMeterVisible] = useState(false)
//   const { toast } = useToast()

//   const toggleExpand = () => setIsExpanded(!isExpanded)
  
//   const toggleAIExpansion = async () => {
//     if (!article.description && !aiExpansion) {
//       toast({
//         title: "No content available",
//         description: "There's no content to expand upon.",
//         variant: "destructive",
//       })
//       return
//     }
    
//     if (!isAIExpansionVisible && !aiExpansion) {
//       await generateAIExpansion()
//     }
    
//     setIsAIExpansionVisible(!isAIExpansionVisible)
//   }

//   const generateAIExpansion = async () => {
//     if (!article.description) {
//       toast({
//         title: "Cannot generate AI expansion",
//         description: "No original content provided to expand upon.",
//         variant: "destructive",
//       })
//       return
//     }
    
//     setIsLoading(true)
//     try {
//       const response = await axios.post('/api/ai-expansion', { text: article.description })
//       setAiExpansion(response.data.expansion)
//     } catch (error) {
//       console.error('Error generating AI expansion:', error)
//       toast({
//         title: "Error",
//         description: "Failed to generate AI expansion. Please try again later.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleShare = async () => {
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: article.title,
//           url: article.url,
//         })
//         toast({
//           title: "Shared successfully",
//           description: "The article has been shared.",
//         })
//       } else {
//         await navigator.clipboard.writeText(article.url)
//         toast({
//           title: "Link copied",
//           description: "The article link has been copied to your clipboard.",
//         })
//       }
//     } catch (error) {
//       console.error('Error sharing article:', error)
//       toast({
//         title: "Error",
//         description: "Failed to share the article. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleTextToSpeech = () => {
//     if (isSpeaking) {
//       window.speechSynthesis.cancel()
//       setIsSpeaking(false)
//     } else {
//       const textToSpeak = isAIExpansionVisible ? aiExpansion : article.description
//       if (!textToSpeak) {
//         toast({
//           title: "No content to read",
//           description: "There's no content available for text-to-speech.",
//           variant: "destructive",
//         })
//         return
//       }
      
//       const utterance = new SpeechSynthesisUtterance(textToSpeak)
//       utterance.onend = () => setIsSpeaking(false)
//       window.speechSynthesis.speak(utterance)
//       setIsSpeaking(true)
//     }
//   }

//   const analyzeBias = async () => {
//     if (!article.description || !article.title) {
//       toast({
//         title: "Cannot analyze bias",
//         description: "Insufficient content for bias analysis.",
//         variant: "destructive",
//       })
//       return
//     }
  
//     setIsAnalyzingBias(true)
//     try {
//       const response = await axios.post('/api/analyze-bias', { 
//         text: article.description,
//         title: article.title
//       })
//       setBiasAnalysis(response.data)
//       setIsBiasMeterVisible(true)
//     } catch (error) {
//       console.error('Error analyzing bias:', error)
//       toast({
//         title: "Error",
//         description: "Failed to analyze bias. Please try again later.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsAnalyzingBias(false)
//     }
//   }

//   const getBiasColor = (rating) => {
//     if (rating <= -0.75) return 'bg-blue-600'
//     if (rating <= -0.5) return 'bg-blue-400'
//     if (rating <= -0.25) return 'bg-blue-200'
//     if (rating < 0.25) return 'bg-gray-200'
//     if (rating < 0.5) return 'bg-red-200'
//     if (rating < 0.75) return 'bg-red-400'
//     return 'bg-red-600'
//   }

//   const biasToProgress = (rating) => ((parseFloat(rating) + 1) / 2) * 100

//   const truncateText = (text, maxLength) => {
//     if (typeof text !== 'string' || text.length === 0) return ''
//     return text.length <= maxLength ? text : `${text.substr(0, maxLength)}...`
//   }

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' }
//     return new Date(dateString).toLocaleDateString(undefined, options)
//   }

//   const saveArticle = () => {
//     const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
//     if (!savedArticles.find(savedArticle => savedArticle.url === article.url)) {
//       savedArticles.push(article);
//       localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
//       toast({ title: "Article Saved", description: "The article has been saved to your collection." });
//     } else {
//       toast({ title: "Already Saved", description: "This article is already in your collection." });
//     }
//   };

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       transition={{ duration: 0.3 }}
//     >
//       <Card className="flex flex-col h-full overflow-hidden">
        // <CardHeader className="relative space-y-2">
        //   <div className="absolute top-2 right-2">
        //     <TooltipProvider >
        //       <Tooltip>
        //         <TooltipTrigger asChild>
        //           <Button variant="ghost" size="icon" onClick={handleShare}>
        //             <Share2 className="h-4 w-4" />
        //             <span className="sr-only">Share Article</span>
        //           </Button>
        //         </TooltipTrigger>
        //         <TooltipContent>
        //           <p>Share Article</p>
        //         </TooltipContent>
        //       </Tooltip>
        //       <Tooltip>
        //         <TooltipTrigger asChild>
        //           <Button variant="ghost" size="icon" onClick={saveArticle}>
        //             <Save className="h-4 w-4" />
        //             <span className="sr-only">Save Article</span>
        //           </Button>
        //         </TooltipTrigger>
        //         <TooltipContent>
        //           <p>Save Article</p>
        //         </TooltipContent>
        //       </Tooltip>
        //     </TooltipProvider>
        //   </div>
        //   <CardTitle className="text-xl line-clamp-2 pr-10">{article.title}</CardTitle>
        //   <div className="flex flex-wrap gap-2 items-center">
        //     <Badge variant="outline" className="self-start">
        //       {article.source?.name || 'Unknown Source'}
        //     </Badge>
        //     {article.categories?.map((category, index) => (
        //       <Badge key={index} variant="secondary">{category}</Badge>
        //     ))}
        //     {article.publishedAt && (
        //       <div className="flex items-center text-sm text-muted-foreground">
        //         <Calendar className="h-4 w-4 mr-1" />
        //         {formatDate(article.publishedAt)}
        //       </div>
        //     )}
        //   </div>
        // </CardHeader>
//         <CardContent className="flex-grow space-y-4">
//           {article.urlToImage ? (
//             <motion.div
//               className="relative w-full h-48 overflow-hidden rounded-md"
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 0.2 }}
//             >
//               <img
//                 src={article.urlToImage}
//                 alt={article.title}
//                 layout="fill"
//                 objectFit="cover"
//               />
//             </motion.div>
//           ) : (
//             <div className="relative w-full h-48 overflow-hidden rounded-md bg-muted flex items-center justify-center">
//               <AlertTriangle className="h-12 w-12 text-muted-foreground" />
//             </div>
//           )}
//           <ScrollArea className={`${isExpanded ? 'h-64' : 'h-24'}`}>
//             {isAIExpansionVisible ? (
//               isLoading ? (
//                 <Skeleton className="w-full h-20" />
//               ) : aiExpansion ? (
//                 <p className="text-sm">{aiExpansion}</p>
//               ) : (
//                 <p className="text-sm italic text-muted-foreground">No AI expansion available</p>
//               )
//             ) : article.description ? (
//               <p className="text-sm">{article.description}</p>
//             ) : (
//               <p className="text-sm italic text-muted-foreground">No description available</p>
//             )}
//           </ScrollArea>
//         </CardContent>
//         <CardFooter className="flex flex-col space-y-4">
//           <div className="flex justify-between items-center w-full">
//             <div className="flex space-x-2">
//               <TooltipProvider>
                // <Tooltip>
                //   <TooltipTrigger asChild>
                //     <Button variant={isSpeaking ? "secondary" : "outline"} size="icon" onClick={handleTextToSpeech}>
                //       <Mic className="h-4 w-4" />
                //       <span className="sr-only">{isSpeaking ? 'Stop Reading' : 'Text-to-Speech'}</span>
                //     </Button>
                //   </TooltipTrigger>
                //   <TooltipContent>
                //     <p>{isSpeaking ? 'Stop Reading' : 'Text-to-Speech'}</p>
                //   </TooltipContent>
                // </Tooltip>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button 
//                       variant={isAIExpansionVisible ? "secondary" : "outline"} 
//                       size="icon" 
//                       onClick={toggleAIExpansion}
//                       disabled={!article.description && !aiExpansion}
//                     >
//                       <MessageCircle className="h-4 w-4" />
//                       <span className="sr-only">{isAIExpansionVisible ? 'Show Original' : 'Show AI Expansion'}</span>
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>{isAIExpansionVisible ? 'Show Original' : 'Show AI Expansion'}</p>
//                   </TooltipContent>
//                 </Tooltip>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       onClick={analyzeBias}
//                       disabled={isAnalyzingBias}
//                     >
//                       <Scale className="h-4 w-4" />
//                       <span className="sr-only">Analyze Bias</span>
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>{isBiasMeterVisible ? 'Hide' : 'Show'} Bias Meter</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </div>
//             <div className="flex space-x-2">
//               <Button variant="outline" size="sm" onClick={toggleExpand}>
//                 {isExpanded ? 'Collapse' : 'Expand'}
//                 {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
//               </Button>
//               <Button asChild size="sm">
//                 <a href={article.url} target="_blank" rel="noopener noreferrer">
//                   Read More
//                   <ExternalLink className="ml-1 h-4 w-4" />
//                 </a>
//               </Button>
//             </div>
//           </div>
          
//           <AnimatePresence>
//             {isBiasMeterVisible && biasAnalysis && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="w-full"
//               >
//                 <div className="flex items-center space-x-2">
//                   <span className="text-xs">Left</span>
//                   <Progress 
//                     value={biasToProgress(biasAnalysis.rating)} 
//                     className={`w-full ${getBiasColor(biasAnalysis.rating)} h-2 rounded-full`}
//                   />
//                   <span className="text-xs">Right</span>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-6 w-6">
//                         <Info className="h-4 w-4" />
//                         <span className="sr-only">Bias Information</span>
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-80">
//                       <div className="space-y-2">
//                         <h4 className="font-medium">Bias Analysis Summary</h4>
//                         <p className="text-sm"><strong>Rating:</strong> {biasAnalysis.rating.toFixed(2)}</p>
//                         <p className="text-sm"><strong>Category:</strong> {biasAnalysis.category}</p>
//                         <p className="text-sm">{truncateText(biasAnalysis.explanation, 150)}</p>
//                         <Link
//                           href={{
//                             pathname: `/bias/${encodeURIComponent(article.title)}`,
//                             query: { 
//                               rating:  biasAnalysis.rating,
//                               category: biasAnalysis.category,
//                               explanation: biasAnalysis.explanation,
//                             },
//                           }}
//                           className="text-primary hover:underline flex items-center"
//                         >
//                           Learn More <ExternalLink className="ml-1 h-4 w-4" />
//                         </Link>
//                       </div>
//                     </PopoverContent>
//                   </Popover>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   )
// }

// export default ArticleCard


"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, MessageCircle, ExternalLink, Share2, AlertTriangle, Scale, ChevronDown, ChevronUp, Info, Calendar, Save } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

const ArticleCard = ({ article, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAIExpansionVisible, setIsAIExpansionVisible] = useState(false)
  const [aiExpansion, setAiExpansion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [biasAnalysis, setBiasAnalysis] = useState(null)
  const [isAnalyzingBias, setIsAnalyzingBias] = useState(false)
  const [isBiasMeterVisible, setIsBiasMeterVisible] = useState(false)
  const { toast } = useToast()
  const [isHoveringButton, setIsHoveringButton] = useState(false)

  const handleMouseEnter = () => {
    setIsHoveringButton(true)
  }

  const handleMouseLeave = () => {
    setIsHoveringButton(false)
  }

  const handleCardClick = () => {
    if (!isHoveringButton) {
      onSelect(article)
    }
  }

  const toggleExpand = () => setIsExpanded(!isExpanded)
  
  const toggleAIExpansion = async () => {
    if (!article.description && !aiExpansion) {
      toast({
        title: "No content available",
        description: "There's no content to expand upon.",
        variant: "destructive",
      })
      return
    }
    
    if (!isAIExpansionVisible && !aiExpansion) {
      await generateAIExpansion()
    }
    
    setIsAIExpansionVisible(!isAIExpansionVisible)
  }

  const generateAIExpansion = async () => {
    if (!article.description) {
      toast({
        title: "Cannot generate AI expansion",
        description: "No original content provided to expand upon.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    try {
      const response = await axios.post('/api/ai-expansion', { text: article.description })
      setAiExpansion(response.data.expansion)
    } catch (error) {
      console.error('Error generating AI expansion:', error)
      toast({
        title: "Error",
        description: "Failed to generate AI expansion. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url: article.url,
        })
        toast({
          title: "Shared successfully",
          description: "The article has been shared.",
        })
      } else {
        await navigator.clipboard.writeText(article.url)
        toast({
          title: "Link copied",
          description: "The article link has been copied to your clipboard.",
        })
      }
    } catch (error) {
      console.error('Error sharing article:', error)
      toast({
        title: "Error",
        description: "Failed to share the article. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTextToSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      const textToSpeak = isAIExpansionVisible ? aiExpansion : article.description
      if (!textToSpeak) {
        toast({
          title: "No content to read",
          description: "There's no content available for text-to-speech.",
          variant: "destructive",
        })
        return
      }
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  const analyzeBias = async () => {
    if (!article.description || !article.title) {
      toast({
        title: "Cannot analyze bias",
        description: "Insufficient content for bias analysis.",
        variant: "destructive",
      })
      return
    }
  
    setIsAnalyzingBias(true)
    try {
      const response = await axios.post('/api/analyze-bias', { 
        text: article.description,
        title: article.title
      })
      setBiasAnalysis(response.data)
      setIsBiasMeterVisible(true)
    } catch (error) {
      console.error('Error analyzing bias:', error)
      toast({
        title: "Error",
        description: "Failed to analyze bias. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzingBias(false)
    }
  }

  const getBiasColor = (rating) => {
    if (rating <= -0.75) return 'bg-blue-600'
    if (rating <= -0.5) return 'bg-blue-400'
    if (rating <= -0.25) return 'bg-blue-200'
    if (rating < 0.25) return 'bg-gray-200'
    if (rating < 0.5) return 'bg-red-200'
    if (rating < 0.75) return 'bg-red-400'
    return 'bg-red-600'
  }

  const biasToProgress = (rating) => ((parseFloat(rating) + 1) / 2) * 100

  const truncateText = (text, maxLength) => {
    if (typeof text !== 'string' || text.length === 0) return ''
    return text.length <= maxLength ? text : `${text.substr(0, maxLength)}...`
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const saveArticle = () => {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    if (!savedArticles.find(savedArticle => savedArticle.url === article.url)) {
      savedArticles.push(article);
      localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      toast({ title: "Article Saved", description: "The article has been saved to your collection." });
    } else {
      toast({ title: "Already Saved", description: "This article is already in your collection." });
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className={`border ${isSelected ? 'border-blue-500' : 'border-transparent'} rounded-md`}
      whileHover={{ scale: 1.05 }} // Scale effect on hover
      transition={{ duration: 0.2 }} // Smooth transition
    >
      <Card className="flex flex-col h-full overflow-hidden relative">
        <CardHeader className="relative space-y-2">
          <div className="absolute top-2 right-2">
            <TooltipProvider >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleShare}
                  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share Article</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Article</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={saveArticle}
                  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <Save className="h-4 w-4" />
                    <span className="sr-only">Save Article</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Article</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="text-xl line-clamp-2 pr-10">{article.title}</CardTitle>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="self-start">
              {article.source?.name || 'Unknown Source'}
            </Badge>
            {article.categories?.map((category, index) => (
              <Badge key={index} variant="secondary">{category}</Badge>
            ))}
            {article.publishedAt && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.publishedAt)}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          {article.urlToImage ? (
            <motion.div
              className="relative w-full h-48 overflow-hidden rounded-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={article.urlToImage}
                alt={article.title}
                layout="fill"
                objectFit="cover"
              />
            </motion.div>
          ) : (
            <div className="relative w-full h-48 overflow-hidden rounded-md bg-muted flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <ScrollArea className={`${isExpanded ? 'h-64' : 'h-24'}`}>
            {isAIExpansionVisible ? (
              isLoading ? (
                <Skeleton className="w-full h-20" />
              ) : aiExpansion ? (
                <p className="text-sm">{aiExpansion}</p>
              ) : (
                <p className="text-sm italic text-muted-foreground">No AI expansion available</p>
              )
            ) : article.description ? (
              <p className="text-sm">{article.description}</p>
            ) : (
              <p className="text-sm italic text-muted-foreground">No description available</p>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-2">
              <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={isSpeaking ? "secondary" : "outline"} size="icon" onClick={handleTextToSpeech}>
                      <Mic className="h-4 w-4" />
                      <span className="sr-only">{isSpeaking ? 'Stop Reading' : 'Text-to-Speech'}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSpeaking ? 'Stop Reading' : 'Text-to-Speech'}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isAIExpansionVisible ? "secondary" : "outline"} 
                      size="icon" 
                      onClick={toggleAIExpansion}
                      disabled={!article.description && !aiExpansion}
                      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="sr-only">{isAIExpansionVisible ? 'Show Original' : 'Show AI Expansion'}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isAIExpansionVisible ? 'Show Original' : 'Show AI Expansion'}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={analyzeBias}
                      disabled={isAnalyzingBias}
                      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                    >
                      <Scale className="h-4 w-4" />
                      <span className="sr-only">Analyze Bias</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isBiasMeterVisible ? 'Hide' : 'Show'} Bias Meter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={toggleExpand} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button asChild size="sm" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read More
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          <AnimatePresence>
            {isBiasMeterVisible && biasAnalysis && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs">Left</span>
                  <Progress 
                    value={biasToProgress(biasAnalysis.rating)} 
                    className={`w-full ${getBiasColor(biasAnalysis.rating)} h-2 rounded-full`}
                  />
                  <span className="text-xs">Right</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Bias Information</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Bias Analysis Summary</h4>
                        <p className="text-sm"><strong>Rating:</strong> {biasAnalysis.rating.toFixed(2)}</p>
                        <p className="text-sm"><strong>Category:</strong> {biasAnalysis.category}</p>
                        <p className="text-sm">{truncateText(biasAnalysis.explanation, 150)}</p>
                        <Link
                          onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
                          href={{
                            pathname: `/bias/${encodeURIComponent(article.title)}`,
                            query: { 
                              rating:  biasAnalysis.rating,
                              category: biasAnalysis.category,
                              explanation: biasAnalysis.explanation,
                            },
                          }}
                          className="text-primary hover:underline flex items-center"
                        >
                          Learn More <ExternalLink className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ArticleCard
