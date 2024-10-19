import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DraggableArticleCard = ({ article, onSelect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'article',
    item: { article },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onSelect(article);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm">{article.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs">{article.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraggableArticleCard;