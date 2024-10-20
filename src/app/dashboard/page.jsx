"use client"

import React, { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Bookmark, Book, BarChart2, Scale } from 'lucide-react';
import Image from 'next/image';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user } = useUser();
  const [greeting, setGreeting] = useState('');
  const {signOut} = useClerk();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const navItems = [
    { title: 'News Feed', icon: Newspaper, href: '/news' },
    { title: 'Saved Articles', icon: Bookmark, href: '/saved' },
    { title: 'Storyboards', icon: Book, href: '/stories' },
    { title: 'Analytics', icon: BarChart2, href: '/analytics' },
    { title: 'Scale', icon: Scale, href: '/scale' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-12 mt-12">
          <Image 
            src="/logo.svg" // Replace with your logo path
            alt="Logo"
            width={275} // Adjust width as needed
            height={50} // Adjust height as needed
            className="mx-auto" // Center the logo
          />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          {greeting}, {user?.firstName || 'there'}!
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Welcome to your personalized news dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <Card className="hover:bg-accent transition-colors duration-300">
                  <CardContent className="flex items-center p-6">
                    <item.icon className="h-8 w-8 mr-4 text-primary" />
                    <div>
                      <h2 className="text-2xl font-semibold">{item.title}</h2>
                      <p className="text-muted-foreground">
                        {getDescription(item.title)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <Button asChild size="lg">
                <Link href="/news">
                  Start Exploring
                </Link>
              </Button>
              <Button variant="outline" onClick={signOut} size="lg">
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

function getDescription(title) {
  switch (title) {
    case 'News Feed':
      return 'Browse the latest news articles';
    case 'Saved Articles':
      return 'Access your bookmarked content';
    case 'Storyboards':
      return 'Create and manage your storyboards';
    case 'Analytics':
      return 'View insights about your activity'; 
    case 'Scale':
      return 'Weigh two articles against each other';
    default:
      return '';
  }
}

export default Dashboard;
