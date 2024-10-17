"use client"

import React from 'react';
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignOutButton } from '@clerk/nextjs';
import { useUser } from '@clerk/clerk-react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LogOut } from "lucide-react";
import Image from 'next/image';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';

export default function AlreadySignedIn() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden">
              <AvatarImage src={user?.imageUrl} alt={user?.fullName} />
            </Avatar>
            <p className="text-center">You're already signed in as:</p>
            <p className="font-semibold">{user?.primaryEmailAddress?.emailAddress}</p>
            <Button
              className="w-full"
              onClick={() => router.push('/news')}
            >
              Go to News <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <SignOutButton>
              <Button variant="outline" className="w-full">
                Sign out <LogOut className="ml-2 h-4 w-4" />
              </Button>
            </SignOutButton>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}