import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ArticleCard = ({ article }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {article.imageUrl && (
          <div className="relative w-full h-48 mb-4">
            <img
              src={article.imageUrl}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
        <p className="text-sm">{article.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{article.source}</span>
        <Button asChild>
          <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;