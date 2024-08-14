// src/app/quiz/create/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import { QuizCreationForm } from '../components/quiz-creation-form';
import { auth } from '@clerk/nextjs/server';

export const metadata = {
  title: 'Creare Quiz | MediLearn',
  description: 'Generează un quiz personalizat bazat pe o lecție din MediLearn.',
};

async function getLessons(userId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("Utilizator negăsit");
  }

  return prisma.lesson.findMany({
    where: { userId: user.id },
    select: { id: true, title: true },
    orderBy: { createdAt: 'desc' },
  });
}

async function getLesson(id: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: { id: true, title: true },
  });

  if (!lesson) {
    throw new Error("Lecția nu a fost găsită");
  }

  return lesson;
}

export default async function CreateQuizPage({
  searchParams
}: {
  searchParams: { lessonId?: string }
}) {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("Utilizator neautentificat");
  }

  const lessons = await getLessons(userId);
  const selectedLesson = searchParams.lessonId 
    ? await getLesson(searchParams.lessonId)
    : null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Creare Quiz</h1>
      {selectedLesson && (
        <p className="text-muted-foreground">
          Pentru lecția: {selectedLesson.title}
        </p>
      )}
      <QuizCreationForm lessons={lessons} selectedLessonId={selectedLesson?.id} />
    </div>
  );
}