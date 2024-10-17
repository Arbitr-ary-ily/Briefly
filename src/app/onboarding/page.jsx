"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    displayName: '',
    interests: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/sign-in');
      } else if (user.unsafeMetadata.onboardingCompleted) {
        router.push('/news');
      } else {
        setUserData({
          displayName: user.unsafeMetadata.displayName || '',
          interests: user.unsafeMetadata.interests || [],
        });
        setIsLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  const handleInputChange = (e) => {
    setUserData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleInterestChange = (interest) => {
    setUserData((prevData) => ({
      ...prevData,
      interests: prevData.interests.includes(interest)
        ? prevData.interests.filter(i => i !== interest)
        : [...prevData.interests, interest],
    }));
  };

  const handleNext = useCallback(async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        await user.update({
          unsafeMetadata: {
            onboardingCompleted: true,
            displayName: userData.displayName,
            interests: userData.interests,
          },
        });
        router.push('/news');
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        alert('Failed to complete onboarding. Please try again.');
        setIsLoading(false);
      }
    }
  }, [step, user, userData, router]);

  if (isLoading || !isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100/50 px-4">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold">Welcome to Briefly</h2>
          <p>Step {step} of 3</p>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div>
              <label htmlFor="displayName">Choose a display name:</label>
              <Input
                id="displayName"
                name="displayName"
                value={userData.displayName}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
          )}
          {step === 2 && (
            <div>
              <p>Select your interests:</p>
              {['Technology', 'Science', 'Politics', 'Sports', 'Entertainment'].map((interest) => (
                <Button
                  key={interest}
                  variant={userData.interests.includes(interest) ? "default" : "outline"}
                  onClick={() => handleInterestChange(interest)}
                  className="mr-2 mt-2"
                >
                  {interest}
                </Button>
              ))}
            </div>
          )}
          {step === 3 && <p>Great! You're all set. Click finish to start exploring news.</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleNext} disabled={!user || !isLoaded || !isSignedIn}>
            {step === 3 ? 'Finish' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}