"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Newspaper, Search, RefreshCw, AlertCircle, Bot, X, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ArticleCard from '../app/ArticleCard';
import { marked } from 'marked';
import debounce from 'lodash/debounce';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from 'next/image';
import { SiGooglegemini } from "react-icons/si";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import StoryboardSidebar from './StoryboardSidebar';
import { trackEvent } from '@/lib/analytics';
import Link from 'next/link';

const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

const NewsAggregator = () => {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [hasOnboardingChecked, setHasOnboardingChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [aiInsights, setAiInsights] = useState('');
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [isTopHeadlines, setIsTopHeadlines] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false); // New state for input focus
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && !hasOnboardingChecked) {
      const checkOnboarding = async () => {
        const onboardingCompleted = user?.unsafeMetadata?.onboardingCompleted;
        if (!onboardingCompleted) {
          router.push('/onboarding');
        } else {
          setHasOnboardingChecked(true);
          fetchTopHeadlines();
        }
      };
      checkOnboarding();
    }
  }, [isLoaded, isSignedIn, user, router, hasOnboardingChecked]);

  const fetchTopHeadlines = async (page = currentPage) => {
    setLoading(true);
    setError(null); // Reset error state
    setIsTopHeadlines(true);
    try {
      const response = await axios.get('/api/top-headlines', {
        params: {
          category: selectedCategory === 'all' ? '' : selectedCategory, // Use '' for all categories
          page: page,
          pageSize: itemsPerPage,
        },
      });
      setArticles(response.data.articles || []);
      setTotalItems(response.data.totalResults || 0);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch top headlines. Please try again later.'); // Set error message
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async (page = currentPage) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.get(isTopHeadlines ? '/api/top-headlines' : '/api/search', {
        params: {
          ...(isTopHeadlines ? { category: selectedCategory === 'all' ? '' : selectedCategory } : { q: searchTerm }),
          page: page,
          pageSize: itemsPerPage,
        },
      });
      setArticles(response.data.articles || []);
      setTotalItems(response.data.totalResults || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(isTopHeadlines ? 'Failed to fetch top headlines. Please try again later.' : 'Failed to fetch search results. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1); // Fetch articles whenever the selected category changes
  }, [selectedCategory, itemsPerPage]); // Dependencies include selectedCategory and itemsPerPage

  const handleSearch = async (page = currentPage) => {
    if (!searchTerm.trim()) return;

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    setLoading(true);
    setError(null);
    setIsTopHeadlines(false);
    try {
      const response = await axios.get('/api/search', {
        params: {
          q: searchTerm,
          page: page,
          pageSize: itemsPerPage,
          category: selectedCategory === 'all' ? '' : selectedCategory,
        },
      });

      // Ensure response.data.articles is an array
      const articlesData = Array.isArray(response.data.articles) ? response.data.articles : [];
      setArticles(articlesData);
      setTotalItems(response.data.totalResults || 0);
      setCurrentPage(page);

      if (searchTerm.trim()) {
        const insightsResponse = await axios.post('/api/ai-insights', { searchTerm, articles: articlesData });
        setAiInsights(insightsResponse.data.insights);
        setShowAiInsights(true);
      }
    } catch (err) {
      setError('Failed to fetch search results. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
    setShowAiInsights(false);
    setIsTopHeadlines(true);
    fetchTopHeadlines(1);
  };

  const handlePageChange = (newPage) => {
    if (isTopHeadlines) {
      fetchTopHeadlines(newPage);
    } else {
      handleSearch(newPage);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // Set the selected category directly
    setCurrentPage(1); // Reset to the first page
  };

  const fetchRecommendations = async (topic) => {
    try {
      const response = await axios.post('/api/recommendations', { topic });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(async (term) => {
      if (term.length > 2) {
        try {
          const response = await axios.post('/api/search-suggestions', { term });
          setSearchSuggestions(response.data.suggestions);
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
        }
      } else {
        setSearchSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchSuggestions(searchTerm);
  }, [searchTerm, debouncedFetchSuggestions]);

  const toggleAiInsights = () => {
    setShowAiInsights(!showAiInsights);
  };

  const formatAiInsights = (insights) => {
    const renderer = new marked.Renderer();
    renderer.heading = (text, level) => {
      return `<h${level} class="text-${4-level}xl font-bold my-4">${text}</h${level}>`;
    };
    renderer.paragraph = (text) => {
      return `<p class="my-2">${text}</p>`;
    };
    renderer.list = (body, ordered) => {
      const type = ordered ? 'ol' : 'ul';
      return `<${type} class="list-${ordered ? 'decimal' : 'disc'} pl-5 my-2">${body}</${type}>`;
    };
    renderer.listitem = (text) => {
      return `<li class="my-1">${text}</li>`;
    };
    renderer.strong = (text) => {
      return `<span class="font-semibold">${text}</span>`;
    };
    renderer.em = (text) => {
      return `<span class="italic">${text}</span>`;
    };
    renderer.codespan = (code) => {
      return `<code class="bg-gray-100 dark:bg-gray-800 rounded px-1">${code}</code>`;
    };
    
    return marked(insights, { renderer });
  };

  const renderAiInsights = (insights) => {
    if (!insights || typeof insights !== 'object') {
      return <p>No insights available.</p>;
    }

    return (
      <div className="space-y-6">
        {insights.summary && (
          <div>
            <h3 className="text-lg font-semibold">Summary</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{insights.summary}</p>
          </div>
        )}

        {insights.themes && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Themes</h3>
            <div className="flex flex-wrap gap-2">
              {insights.themes.map((theme, index) => (
                <Badge key={index} variant="secondary">{theme}</Badge>
              ))}
            </div>
          </div>
        )}

        {insights.trends && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Trends</h3>
            <ul className="list-disc pl-5">
              {insights.trends.map((trend, index) => (
                <li key={index}>{trend}</li>
              ))}
            </ul>
          </div>
        )}

        {insights.suggestions && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
            {insights.suggestions.map((suggestion, index) => (
              <React.Fragment key={index}>
                <p>{suggestion}</p>
                {index < insights.suggestions.length - 1 && <Separator className="my-2" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {insights.risks && (
          <Alert>
            <AlertDescription>
              <h3 className="text-lg font-semibold mb-2">Risks</h3>
              <ul className="list-disc pl-5">
                {insights.risks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {insights.opportunities && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Opportunities</h3>
            <Table>
              <TableBody>
                {insights.opportunities.map((opportunity, index) => (
                  <TableRow key={index}>
                    <TableCell>{opportunity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {insights.recommendations && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
            <div className="grid grid-cols-2 gap-2">
              {insights.recommendations.map((recommendation, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <p>{recommendation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleArticleSelect = useCallback((article) => {
    setSelectedArticles((prev) => {
      const updatedArticles = prev.some((a) => a.url === article.url)
        ? prev.filter((a) => a.url !== article.url)
        : [...prev, article];

      // Store selected articles in local storage
      localStorage.setItem('selectedArticles', JSON.stringify(updatedArticles));
      return updatedArticles;
    });
    setIsSidebarOpen(true);
  }, []);

  const renderArticles = () => {
    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(itemsPerPage)].map((_, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    // Log articles before rendering
    console.log('Articles to render:', articles);

    return (
      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {articles.length > 0 ? (
            articles.map((article, index) => {
              // Ensure article is a valid object
              if (typeof article !== 'object' || article === null) {
                console.error('Invalid article object:', article);
                return null; // Skip rendering this article
              }
              return (
                <motion.div
                  key={article.url || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArticleCard article={article} onSelect={handleArticleSelect} />
                </motion.div>
              );
            })
          ) : (
            <p>No articles found.</p>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!hasOnboardingChecked) {
    return null;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8 relative">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <motion.h1 
            className="text-3xl font-bold flex items-center mt-1 cursor-pointer" // Added cursor-pointer class
            whileHover={{ scale: 1.05 }}
            // onClick={() => window.location.reload()} // Refresh the page on click
          >
              <Link href="/dashboard">
                <Image src="/logo.svg" alt="Logo" width={275} height={50} className="" />
              </Link>
          </motion.h1>
          <div className="flex items-center space-x-4">
            <div className="flex w-full sm:w-auto space-x-2">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  className="flex-grow"
                />
                <AnimatePresence>
                  {isInputFocused && searchSuggestions.length > 0 && ( // Check if input is focused
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full bg-background border rounded-md shadow-lg"
                    >
                      {searchSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          className="px-4 py-2 hover:bg-accent cursor-pointer"
                          whileHover={{ backgroundColor: 'var(--accent)' }}
                          onClick={() => {
                            setSearchTerm(suggestion);
                            setSearchSuggestions([]);
                            handleSearch();
                          }}
                        >
                          {suggestion}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleSearch} disabled={loading}>
                      <Search className="mr-2" />
                      Search
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search for news articles</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh news</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={toggleAiInsights}>
                      <SiGooglegemini className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle AI Insights</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="flex flex-col lg:flex-row">
          <div className={`flex-grow ${showAiInsights ? 'lg:w-2/3' : 'w-full'} transition-all duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <motion.h2 
                className="text-2xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isTopHeadlines ? 'Top Headlines' : 'Search Results'}
              </motion.h2>
              <div className="flex space-x-2">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1); // Reset to the first page
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {recommendations.length > 0 && (
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold mb-2">Trending Topics:</h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => {
                          setSearchTerm(rec);
                          handleSearch();
                        }}
                      >
                        {rec}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {renderArticles()} {/* Call the new render function here */}

            {totalItems > itemsPerPage && (
              <motion.div 
                className="mt-8 flex justify-center items-center space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {showAiInsights && (
              <motion.div 
                className="lg:w-1/3 mt-8 lg:mt-0 lg:ml-8"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.3
                }}
              >
                <Card className="sticky top-4">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center">
                      <SiGooglegemini className="h-6 w-6 mr-2" />
                      <CardTitle>AI Insights</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={toggleAiInsights}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[calc(100vh-200px)]">
                      {renderAiInsights(aiInsights)}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {isSidebarOpen && (
            <StoryboardSidebar
              selectedArticles={selectedArticles}
              onArticleSelect={handleArticleSelect}
              onClose={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
};

export default NewsAggregator;
