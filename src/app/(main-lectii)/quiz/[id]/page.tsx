// src/app/quiz/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteQuizButton } from '../components/delete-quiz-button';
import { Play, ArrowLeft } from "lucide-react";

export const metadata = {
  title: 'Detalii Quiz | MediLearn',
  description: 'Vizualizează detaliile unui quiz și începe sau șterge quiz-ul.',
};

async function getQuiz(id: string, userId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id, userId },
    include: {
      lesson: true,
      questions: {
        select: {
          id: true,
          questionText: true,
        },
      },
      _count: {
        select: { questions: true }
      }
    },
  });

  if (!quiz) {
    notFound();
  }

  return quiz;
}

export default async function QuizPage({ params }: { params: { id: string } }) {
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <Button variant="outline" asChild>
          <Link href="/quiz">
            <ArrowLeft className="mr-2 h-4 w-4" /> Înapoi la Lista de Quiz-uri
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalii Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Lecție asociată:</strong> {quiz.lesson.title}</p>
          <p><strong>Număr de întrebări:</strong> {quiz._count.questions}</p>
          <p><strong>Data creării:</strong> {new Date(quiz.createdAt).toLocaleDateString('ro-RO')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Întrebări</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {quiz.questions.map((question, index) => (
              <li key={question.id} className="mb-2">
                {question.questionText}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button asChild>
          <Link href={`/quiz/${quiz.id}/start`}>
            <Play className="mr-2 h-4 w-4" /> Începe Quiz-ul
          </Link>
        </Button>
        <DeleteQuizButton quizId={quiz.id} />
      </div>
    </div>
  );
}