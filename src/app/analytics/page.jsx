"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { getUserAnalytics } from '@/lib/analytics';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function AnalyticsPage() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (user) {
        const data = await getUserAnalytics(user.id);
        setAnalytics(data);
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const storyboardsCreated = analytics.filter(event => event.event_type === 'storyboard_created').length;
  const aiInsightsGenerated = analytics.filter(event => event.event_type === 'ai_insights_generated').length;

  return (
    <div className="container mx-auto px-4 py-8">
                      <Image src="/logo.svg" alt="Logo" width={275} height={50} className="mb-8" />

      <h1 className="text-3xl font-bold mb-6">Your Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Storyboards Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-400">{storyboardsCreated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Insights Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-400">{aiInsightsGenerated}</p>
          </CardContent>
        </Card>
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {analytics.slice(0, 10).map((event, index) => (
          <Card key={index}>
            <CardContent className="py-4">
              <p className="font-semibold text-yellow-400">{event.event_type.replace('_', ' ').toUpperCase()}</p>
              <p className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}