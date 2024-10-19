"use client"

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const BiasAnalysisPage = () => {
  const params = useParams();
  const [biasAnalysis, setBiasAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedPhrase, setSelectedPhrase] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const storedAnalysis = localStorage.getItem('biasAnalysis');
        if (storedAnalysis) {
          setBiasAnalysis(JSON.parse(storedAnalysis));
        } else {
          throw new Error('No bias analysis data found.');
        }
      } catch (error) {
        console.error('Error fetching bias analysis data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const progressPercentage = ((biasAnalysis.rating + 1) / 2) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 max-w-4xl"
    >
      <h1 className="text-4xl font-bold mb-6 text-center">
        Bias Analysis: {decodeURIComponent(params.title)}
      </h1>
      
      <Card className="mb-6 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-4">
            <div className="text-3xl font-bold mb-4">Bias Rating: {biasAnalysis.rating.toFixed(2)}</div>
            <div className="w-full max-w-md">
              <Progress
                value={[progressPercentage]}
                max={100}
                step={1}
                className="w-full h-2"
                disabled
              />
            </div>
            <div className="flex justify-between w-full max-w-md mt-1">
              <span className="text-sm">Left-leaning</span>
              <span className="text-sm">Neutral</span>
              <span className="text-sm">Right-leaning</span>
            </div>
          </div>
          <div className="text-center">
            <Badge variant={biasAnalysis.confidenceLevel > 7 ? "success" : biasAnalysis.confidenceLevel > 4 ? "warning" : "secondary"}>
              Confidence: {biasAnalysis.confidenceLevel}/10
            </Badge>
            <p className="text-sm text-gray-600 mt-2">{biasAnalysis.confidenceExplanation}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="literacy">Media Literacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Key Takeaways</h2>
              <ul className="space-y-2">
                <li>• {biasAnalysis.explanation}</li>
                <li>• {biasAnalysis.balancedPerspective}</li>
                <li>• {biasAnalysis.emotionAnalysis}</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detailed">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {['factVsOpinion', 'sourceCredibility', 'languageAnalysis', 'ideologicalAlignment', 'historicalContext', 'comparativeAnalysis'].map((section) => (
                <div key={section} className="border-b pb-4 last:border-b-0">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection(section)}
                  >
                    <h3 className="text-lg font-semibold capitalize">{section.replace(/([A-Z])/g, ' $1').trim()}</h3>
                    {expandedSections[section] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  {expandedSections[section] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2"
                    >
                      <p>{biasAnalysis[section]}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="literacy">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Media Literacy Tips</h2>
              <ul className="list-disc pl-5 space-y-2">
                {biasAnalysis.mediaLiteracyTips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Key Phrases</h2>
          <div className="flex flex-wrap gap-2">
            {biasAnalysis.keyPhrases.map((item, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="cursor-pointer transition-colors hover:bg-secondary"
                onClick={() => setSelectedPhrase(item.explanation)}
              >
                {item.phrase}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2 italic opacity-50">Click on a phrase to see its explanation.</p>
          {selectedPhrase && (
            <p className="mt-2 text-gray-700">{selectedPhrase}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BiasAnalysisPage;
