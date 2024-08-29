import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { QuizCreationForm } from '../components/quiz-creation-form';

export const metadata: Metadata = {
  title: 'Creare Quiz Nou | BrightLearn',
  description: 'Creează un nou quiz interactiv pentru a testa cunoștințele tale sau ale altora.',
  openGraph: {
    title: 'Creare Quiz Nou | BrightLearn',
    description: 'Creează un nou quiz interactiv pentru a testa cunoștințele tale sau ale altora.',
    type: 'website',
  },
};

async function getLessons(userId: string) {
  return prisma.lesson.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function CreateQuizPage() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("Utilizator neautentificat");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("Utilizator negăsit în baza de date");
  }

  const lessons = await getLessons(user.id);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Creare Quiz Nou</h1>
      <QuizCreationForm lessons={lessons} />
    </div>
  );
}