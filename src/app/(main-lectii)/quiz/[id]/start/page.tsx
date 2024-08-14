// src/app/quiz/[id]/start/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { QuizTakingForm } from '../../components/quiz-taking-form';
import { rephraseQuestions } from '../../actions/rephrase-questions';

export const metadata = {
  title: 'Luare Quiz | MediLearn',
  description: 'Răspunde la întrebările din quiz și testează-ți cunoștințele.',
};

async function getQuiz(id: string, userId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id, userId },
    include: {
      questions: true,
      lesson: {
        select: { title: true }
      }
    },
  });

  if (!quiz) {
    notFound();
  }

  return quiz;
}

export default async function QuizTakingPage({ params }: { params: { id: string } }) {
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

  const quiz = await getQuiz(params.id, user.id);
  
  // Rephrase questions using ChatGPT
  const rephrasedQuestions = await rephraseQuestions(quiz.questions);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{quiz.title}</h1>
      <p className="text-muted-foreground">Lecție: {quiz.lesson.title}</p>
      <QuizTakingForm quizId={quiz.id} questions={rephrasedQuestions} />
    </div>
  );
}