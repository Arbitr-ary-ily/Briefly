// "use client"

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Newspaper, Search, RefreshCw, AlertCircle, Filter } from "lucide-react";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Pagination } from "@/components/ui/pagination";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import ArticleCard from './ArticleCard';

// const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

// const NewsAggregator = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(20);
//   const [totalItems, setTotalItems] = useState(0);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [aiInsights, setAiInsights] = useState('');
//   const [showAiInsights, setShowAiInsights] = useState(false);
//   const [isTopHeadlines, setIsTopHeadlines] = useState(true);

//   useEffect(() => {
//     if (isTopHeadlines) {
//       fetchTopHeadlines();
//     } else {
//       handleSearch();
//     }
//   }, [currentPage, itemsPerPage, selectedCategory, isTopHeadlines]);

//   const fetchTopHeadlines = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('/api/top-headlines', {
//         params: {
//           category: selectedCategory,
//           page: currentPage,
//           pageSize: itemsPerPage,
//         }
//       });
//       setArticles(response.data.articles || []);
//       setTotalItems(response.data.totalResults || 0);
//     } catch (err) {
//       setError('Failed to fetch top headlines');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchTerm.trim() && !isTopHeadlines) return;
    
//     setLoading(true);
//     setError(null);
//     setIsTopHeadlines(false);
//     try {
//       const response = await axios.get('/api/search', {
//         params: {
//           q: searchTerm,
//           page: currentPage,
//           pageSize: itemsPerPage,
//           sortBy: 'publishedAt',
//         }
//       });
//       setArticles(response.data.articles || []);
//       setTotalItems(response.data.totalResults || 0);
      
//       // Generate AI insights for the search results
//       if (searchTerm.trim()) {
//         const insightsResponse = await axios.post('/api/ai-insights', { searchTerm, articles: response.data.articles });
//         setAiInsights(insightsResponse.data.insights);
//         setShowAiInsights(true);
//       }
//     } catch (err) {
//       setError('Failed to fetch search results');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     setSearchTerm('');
//     setSelectedCategory('');
//     setCurrentPage(1);
//     setShowAiInsights(false);
//     setIsTopHeadlines(true);
//     fetchTopHeadlines();
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     setCurrentPage(1);
//     setIsTopHeadlines(true);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <header className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
//         <h1 className="text-3xl font-bold flex items-center mt-1">
//           <Newspaper className="mr-2" /> News Aggregator
//         </h1>
//         <div className="flex w-full sm:w-auto space-x-2">
//           <Input
//             type="text"
//             placeholder="Search news..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="flex-grow"
//           />
//           <Button onClick={handleSearch} disabled={loading}>
//             <Search className="mr-2" />
//             Search
//           </Button>
//           <Button variant="outline" onClick={handleRefresh} disabled={loading}>
//             <RefreshCw className="h-4 w-4" />
//           </Button>
//         </div>
//       </header>

//       <main>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold">
//             {isTopHeadlines ? 'Top Headlines' : 'Search Results'}
//           </h2>
//           <div className="flex space-x-2">
//           <Select value={selectedCategory} onValueChange={handleCategoryChange}>
//   <SelectTrigger className="w-[180px]">
//     <SelectValue placeholder="Select category" />
//   </SelectTrigger>
//   <SelectContent>
//     <SelectItem value="all">All Categories</SelectItem> {/* Changed value from "" to "all" */}
//     {categories.map((category) => (
//       <SelectItem key={category} value={category}>
//         {category}
//       </SelectItem>
//     ))}
//   </SelectContent>
// </Select>

// <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
//   <SelectTrigger className="w-[180px]">
//     <SelectValue placeholder="Items per page" />
//   </SelectTrigger>
//   <SelectContent>
//     <SelectItem value="20">20 per page</SelectItem>
//     <SelectItem value="50">50 per page</SelectItem>
//     <SelectItem value="100">100 per page</SelectItem>
//   </SelectContent>
// </Select>

//           </div>
//         </div>

//         {showAiInsights && (
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button variant="outline" className="mb-4">
//                 <Filter className="mr-2 h-4 w-4" />
//                 View AI Insights
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[425px]">
//               <DialogHeader>
//                 <DialogTitle>AI Insights</DialogTitle>
//                 <DialogDescription>
//                   Here are some AI-generated insights based on your search results:
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="mt-4">
//                 <p>{aiInsights}</p>
//               </div>
//             </DialogContent>
//           </Dialog>
//         )}

//         {loading && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {[...Array(itemsPerPage)].map((_, index) => (
//               <Card key={index} className="flex flex-col h-full">
//                 <CardHeader>
//                   <Skeleton className="h-6 w-3/4" />
//                 </CardHeader>
//                 <CardContent>
//                   <Skeleton className="h-4 w-1/4 mb-2" />
//                   <Skeleton className="h-4 w-full mb-2" />
//                   <Skeleton className="h-4 w-full mb-2" />
//                   <Skeleton className="h-4 w-2/3" />
//                 </CardContent>
//                 <CardFooter className="flex justify-between items-center">
//                   <Skeleton className="h-6 w-16" />
//                   <Skeleton className="h-8 w-24" />
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         )}

//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {!loading && !error && (
//           <div className="relative h-[calc(100vh-280px)]">
//             <ScrollArea className="absolute inset-0 p-4 overflow-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {articles && articles.length > 0 ? (
//                   articles.map((article, index) => (
//                     <ArticleCard key={index} article={article} />
//                   ))
//                 ) : (
//                   <p>No articles found.</p>
//                 )}
//               </div>
//             </ScrollArea>
//           </div>
//         )}

//         {totalItems > itemsPerPage && (
//           <div className="mt-8">
//             <Pagination
//               totalItems={totalItems}
//               itemsPerPage={itemsPerPage}
//               currentPage={currentPage}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default NewsAggregator;

// "use client"

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Newspaper, Search, RefreshCw, AlertCircle, Filter, X, Bot } from "lucide-react";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Pagination } from "@/components/ui/pagination";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import ArticleCard from './ArticleCard';
// import { marked } from 'marked';
// import debounce from 'lodash/debounce';

// const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

// const NewsAggregator = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(20);
//   const [totalItems, setTotalItems] = useState(0);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [aiInsights, setAiInsights] = useState('');
//   const [showAiInsights, setShowAiInsights] = useState(false);
//   const [isTopHeadlines, setIsTopHeadlines] = useState(true);
//   const [recommendations, setRecommendations] = useState([]);
//   const [searchSuggestions, setSearchSuggestions] = useState([]);

  // useEffect(() => {
  //   if (isTopHeadlines) {
  //     fetchTopHeadlines();
  //   } else {
  //     handleSearch();
  //   }
  // }, [currentPage, itemsPerPage, selectedCategory, isTopHeadlines]);

  // const fetchTopHeadlines = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axios.get('/api/top-headlines', {
  //       params: {
  //         category: selectedCategory,
  //         page: currentPage,
  //         pageSize: itemsPerPage,
  //       }
  //     });
  //     setArticles(response.data.articles || []);
  //     setTotalItems(response.data.totalResults || 0);
  //   } catch (err) {
  //     setError('Failed to fetch top headlines');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSearch = async () => {
  //   if (!searchTerm.trim() && !isTopHeadlines) return;
    
  //   setLoading(true);
  //   setError(null);
  //   setIsTopHeadlines(false);
  //   try {
  //     const response = await axios.get('/api/search', {
  //       params: {
  //         q: searchTerm,
  //         page: currentPage,
  //         pageSize: itemsPerPage,
  //         sortBy: 'publishedAt',
  //       }
  //     });
  //     setArticles(response.data.articles || []);
  //     setTotalItems(response.data.totalResults || 0);
      
  //     // Generate AI insights for the search results
  //     if (searchTerm.trim()) {
  //       const insightsResponse = await axios.post('/api/ai-insights', { searchTerm, articles: response.data.articles });
  //       setAiInsights(marked(insightsResponse.data.insights));
  //       setShowAiInsights(true);
  //     }
  //   } catch (err) {
  //     setError('Failed to fetch search results');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleRefresh = () => {
  //   setSearchTerm('');
  //   setSelectedCategory('');
  //   setCurrentPage(1);
  //   setShowAiInsights(false);
  //   setIsTopHeadlines(true);
  //   fetchTopHeadlines();
  // };

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  // const handleCategoryChange = (category) => {
  //   setSelectedCategory(category);
  //   setCurrentPage(1);
  //   setIsTopHeadlines(true);
  // };

  // const fetchRecommendations = async (topic) => {
  //   try {
  //     const response = await axios.post('/api/recommendations', { topic });
  //     setRecommendations(response.data.recommendations);
  //   } catch (error) {
  //     console.error('Error fetching recommendations:', error);
  //   }
  // };

  // const debouncedFetchSuggestions = useCallback(
  //   debounce(async (term) => {
  //     if (term.length > 2) {
  //       try {
  //         const response = await axios.post('/api/search-suggestions', { term });
  //         setSearchSuggestions(response.data.suggestions);
  //       } catch (error) {
  //         console.error('Error fetching search suggestions:', error);
  //       }
  //     } else {
  //       setSearchSuggestions([]);
  //     }
  //   }, 300),
  //   []
  // );

  // useEffect(() => {
  //   debouncedFetchSuggestions(searchTerm);
  // }, [searchTerm, debouncedFetchSuggestions]);

  // const toggleAiInsights = () => {
  //   setShowAiInsights(!showAiInsights);
  // };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <header className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
//         <h1 className="text-3xl font-bold flex items-center mt-1">
//           <Newspaper className="mr-2" /> News Aggregator
//         </h1>
//         <div className="flex w-full sm:w-auto space-x-2">
//           <div className="relative w-full">
//             <Input
//               type="text"
//               placeholder="Search news..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="flex-grow"
//             />
//             {searchSuggestions.length > 0 && (
//               <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
//                 {searchSuggestions.map((suggestion, index) => (
//                   <div
//                     key={index}
//                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => {
//                       setSearchTerm(suggestion);
//                       setSearchSuggestions([]);
//                       handleSearch();
//                     }}
//                   >
//                     {suggestion}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <Button onClick={handleSearch} disabled={loading}>
//             <Search className="mr-2" />
//             Search
//           </Button>
//           <Button variant="outline" onClick={handleRefresh} disabled={loading}>
//             <RefreshCw className="h-4 w-4" />
//           </Button>
//           <Button variant="outline" onClick={toggleAiInsights}>
//             <Bot className="h-4 w-4" />
//           </Button>
//         </div>
//       </header>

//       <main className="flex">
//         <div className={`flex-grow ${showAiInsights ? 'mr-4' : ''}`}>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold">
//               {isTopHeadlines ? 'Top Headlines' : 'Search Results'}
//             </h2>
//             <div className="flex space-x-2">
//               <Select value={selectedCategory} onValueChange={handleCategoryChange}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Categories</SelectItem>
//                   {categories.map((category) => (
//                     <SelectItem key={category} value={category}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Items per page" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="20">20 per page</SelectItem>
//                   <SelectItem value="50">50 per page</SelectItem>
//                   <SelectItem value="100">100 per page</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {recommendations.length > 0 && (
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold mb-2">Trending Topics:</h3>
//               <div className="flex flex-wrap gap-2">
//                 {recommendations.map((rec, index) => (
//                   <Badge
//                     key={index}
//                     variant="secondary"
//                     className="cursor-pointer"
//                     onClick={() => {
//                       setSearchTerm(rec);
//                       handleSearch();
//                     }}
//                   >
//                     {rec}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}

//           {loading && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {[...Array(itemsPerPage)].map((_, index) => (
//                 <Card key={index} className="flex flex-col h-full">
//                   <CardHeader>
//                     <Skeleton className="h-6 w-3/4" />
//                   </CardHeader>
//                   <CardContent>
//                     <Skeleton className="h-4 w-1/4 mb-2" />
//                     <Skeleton className="h-4 w-full mb-2" />
//                     <Skeleton className="h-4 w-full mb-2" />
//                     <Skeleton className="h-4 w-2/3" />
//                   </CardContent>
//                   <CardFooter className="flex justify-between items-center">
//                     <Skeleton className="h-6 w-16" />
//                     <Skeleton className="h-8 w-24" />
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {error && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {!loading && !error && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {articles && articles.length > 0 ? (
//                 articles.map((article, index) => (
//                   <ArticleCard key={index} article={article} />
//                 ))
//               ) : (
//                 <p>No articles found.</p>
//               )}
//             </div>
//           )}

//           {totalItems > itemsPerPage && (
//             <div className="mt-8">
//               <Pagination
//                 totalItems={totalItems}
//                 itemsPerPage={itemsPerPage}
//                 currentPage={currentPage}
//                 onPageChange={handlePageChange}
//               />
//             </div>
//           )}
//         </div>

//         {showAiInsights && (
//           <div className="w-1/3 ml-4">
//             <Card className="sticky top-4">
//               <CardHeader>
//                 <CardTitle>AI Insights</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div dangerouslySetInnerHTML={{ __html: aiInsights }} />
//               </CardContent>
//             </Card>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default NewsAggregator;
// "use client"

// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@clerk/nextjs';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Newspaper, Search, RefreshCw, AlertCircle, Bot, X } from "lucide-react";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Pagination } from "@/components/ui/pagination";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Badge } from "@/components/ui/badge";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import ArticleCard from '../app/ArticleCard';
// import { marked } from 'marked';
// import debounce from 'lodash/debounce';

// const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

// const NewsAggregator = () => {
//   const router = useRouter();
//   const { isSignedIn, user, isLoaded } = useUser();
//   const [hasOnboardingChecked, setHasOnboardingChecked] = useState(false); // New state for onboarding check
//   const [searchTerm, setSearchTerm] = useState('');
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(20);
//   const [totalItems, setTotalItems] = useState(0);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [aiInsights, setAiInsights] = useState('');
//   const [showAiInsights, setShowAiInsights] = useState(false);
//   const [isTopHeadlines, setIsTopHeadlines] = useState(true);
//   const [recommendations, setRecommendations] = useState([]);
//   const [searchSuggestions, setSearchSuggestions] = useState([]);

//   // Onboarding and sign-in check


//   const fetchTopHeadlines = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get('/api/top-headlines', {
//         params: {
//           category: selectedCategory,
//           page: currentPage,
//           pageSize: itemsPerPage,
//         },
//       });
//       setArticles(response.data.articles || []);
//       setTotalItems(response.data.totalResults || 0);
//     } catch (err) {
//       setError('Failed to fetch top headlines');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (!searchTerm.trim() && !isTopHeadlines) return;

//     if (!isSignedIn) {
//       router.push('/sign-in');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setIsTopHeadlines(false);
//     try {
//       const response = await axios.get('/api/search', {
//         params: {
//           q: searchTerm,
//           page: currentPage,
//           pageSize: itemsPerPage,
//           sortBy: 'publishedAt',
//         },
//       });
//       setArticles(response.data.articles || []);
//       setTotalItems(response.data.totalResults || 0);

//       if (searchTerm.trim()) {
//         const insightsResponse = await axios.post('/api/ai-insights', { searchTerm, articles: response.data.articles });
//         setAiInsights(marked(insightsResponse.data.insights));
//         setShowAiInsights(true);
//       }
//     } catch (err) {
//       setError('Failed to fetch search results');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     setSearchTerm('');
//     setSelectedCategory('');
//     setCurrentPage(1);
//     setShowAiInsights(false);
//     setIsTopHeadlines(true);
//     fetchTopHeadlines();
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     setCurrentPage(1);
//     setIsTopHeadlines(true);
//   };

//   const fetchRecommendations = async (topic) => {
//     try {
//       const response = await axios.post('/api/recommendations', { topic });
//       setRecommendations(response.data.recommendations);
//     } catch (error) {
//       console.error('Error fetching recommendations:', error);
//     }
//   };

//   const debouncedFetchSuggestions = useCallback(
//     debounce(async (term) => {
//       if (term.length > 2) {
//         try {
//           const response = await axios.post('/api/search-suggestions', { term });
//           setSearchSuggestions(response.data.suggestions);
//         } catch (error) {
//           console.error('Error fetching search suggestions:', error);
//         }
//       } else {
//         setSearchSuggestions([]);
//       }
//     }, 300),
//     []
//   );

//   useEffect(() => {
//     debouncedFetchSuggestions(searchTerm);
//   }, [searchTerm, debouncedFetchSuggestions]);

//   const toggleAiInsights = () => {
//     setShowAiInsights(!showAiInsights);
//   };


//   return (
//     <div className="container mx-auto px-4 py-8">
//       <header className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
//         <motion.h1 
//           className="text-3xl font-bold flex items-center mt-1"
//           whileHover={{ scale: 1.05 }}
//         >
//           <Newspaper className="mr-2" /> AI News Aggregator
//         </motion.h1>
//         <div className="flex w-full sm:w-auto space-x-2">
//           <div className="relative w-full">
//             <Input
//               type="text"
//               placeholder="Search news..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="flex-grow"
//             />
//             <AnimatePresence>
//               {searchSuggestions.length > 0 && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="absolute z-10 w-full bg-background border rounded-md shadow-lg"
//                 >
//                   {searchSuggestions.map((suggestion, index) => (
//                     <motion.div
//                       key={index}
//                       className="px-4 py-2 hover:bg-accent cursor-pointer"
//                       whileHover={{ backgroundColor: 'var(--accent)' }}
//                       onClick={() => {
//                         setSearchTerm(suggestion);
//                         setSearchSuggestions([]);
//                         handleSearch();
//                       }}
//                     >
//                       {suggestion}
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button onClick={handleSearch} disabled={loading}>
//                   <Search className="mr-2" />
//                   Search
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Search for news articles</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="outline" onClick={handleRefresh} disabled={loading}>
//                   <RefreshCw className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Refresh news</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="outline" onClick={toggleAiInsights}>
//                   <Bot className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Toggle AI Insights</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//       </header>

//       <main className="flex flex-col lg:flex-row">
//         <div className={"flex-grow ${showAiInsights ? 'lg:w-2/3' : 'w-full'} transition-all duration-300"}>
//           <div className="flex justify-between items-center mb-4">
//             <motion.h2 
//               className="text-2xl font-semibold"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               {isTopHeadlines ? 'Top Headlines' : 'Search Results'}
//             </motion.h2>
//             <div className="flex space-x-2">
//               <Select value={selectedCategory} onValueChange={handleCategoryChange}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Categories</SelectItem>
//                   {categories.map((category) => (
//                     <SelectItem key={category} value={category}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Items per page" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="20">20 per page</SelectItem>
//                   <SelectItem value="50">50 per page</SelectItem>
//                   <SelectItem value="100">100 per page</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {recommendations.length > 0 && (
//             <motion.div 
//               className="mb-4"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//             >
//               <h3 className="text-lg font-semibold mb-2">Trending Topics:</h3>
//               <div className="flex flex-wrap gap-2">
//                 {recommendations.map((rec, index) => (
//                   <motion.div
//                     key={index}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Badge
//                       variant="secondary"
//                       className="cursor-pointer"
//                       onClick={() => {
//                         setSearchTerm(rec);
//                         handleSearch();
//                       }}
//                     >
//                       {rec}
//                     </Badge>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {loading && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {[...Array(itemsPerPage)].map((_, index) => (
//                 <Card key={index} className="flex flex-col h-full">
//                   <CardHeader>
//                     <Skeleton className="h-6 w-3/4" />
//                   </CardHeader>
//                   <CardContent>
//                     <Skeleton className="h-4 w-1/4 mb-2" />
//                     <Skeleton className="h-4 w-full mb-2" />
//                     <Skeleton className="h-4 w-full mb-2" />
//                     <Skeleton className="h-4 w-2/3" />
//                   </CardContent>
//                   <CardFooter className="flex justify-between items-center">
//                     <Skeleton className="h-6 w-16" />
//                     <Skeleton className="h-8 w-24" />
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {error && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {!loading && !error && (
//             <AnimatePresence>
//               <motion.div 
//                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ staggerChildren: 0.1 }}
//               >
//                 {articles && articles.length > 0 ? (
//                   articles.map((article, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       transition={{ delay: index * 0.1 }}
//                     >
//                       <ArticleCard article={article} />
//                     </motion.div>
//                   ))
//                 ) : (
//                   <p>No articles found.</p>
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           )}

//           {totalItems > itemsPerPage && (
//             <motion.div 
//               className="mt-8"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//             >
//               <Pagination
//                 totalItems={totalItems}
//                 itemsPerPage={itemsPerPage}
//                 currentPage={currentPage}
//                 onPageChange={handlePageChange}
//               />
//             </motion.div>
//           )}
//         </div>

//         <AnimatePresence>
//           {showAiInsights && (
//             <motion.div 
//               className="lg:w-1/3 mt-8 lg:mt-0 lg:ml-8"
//               initial={{ opacity: 0, x: 100 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 100 }}
//               transition={{ type: 'spring', stiffness: 100 }}
//               >
//                 <Card className="sticky top-4">
//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <CardTitle>AI Insights</CardTitle>
//                     <Button variant="ghost" size="sm" onClick={toggleAiInsights}>
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </CardHeader>
//                   <CardContent>
//                     <ScrollArea className="h-[calc(100vh-200px)]">
//                       <div 
//                         className="prose prose-sm dark:prose-invert"
//                         dangerouslySetInnerHTML={{ __html: aiInsights }} 
//                       />
//                     </ScrollArea>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </main>
//       </div>
//     );
//   };
  
//   export default NewsAggregator;
  