// src/app/lectii/[id]/ai/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AIChat } from '../../components/ai-chat';

interface LessonAIPageProps {
  params: { id: string };
}

async function getLesson(id: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: { id: true, title: true, content: true },
  });

  if (!lesson) notFound();

  return lesson;
}

export default async function LessonAIPage({ params }: LessonAIPageProps) {
  const lesson = await getLesson(params.id);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Învață cu AI: {lesson.title}</h1>
      <AIChat lessonContent={lesson.content} lessonId={lesson.id} />
    </div>
  );
}