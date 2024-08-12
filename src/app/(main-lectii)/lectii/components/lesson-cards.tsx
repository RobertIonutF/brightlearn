// /src/app/lectii/components/lesson-cards.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Lesson, User, Category, Tag } from '@prisma/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LessonCardsProps {
  lessons: (Lesson & { user: User; category: Category; tags: Tag[] })[];
}

export function LessonCards({ lessons }: LessonCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <Card key={lesson.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Categorie: {lesson.category.name}
            </p>
            <div className="mt-2">
              {lesson.tags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="mr-1 mb-1">
                  {tag.name}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Data Creării: {new Date(lesson.createdAt).toLocaleDateString('ro-RO')}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/lectii/${lesson.id}`}>Vezi Lecția</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}