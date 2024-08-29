import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizResultsChart } from '../../components/quiz-results-chart';
import { QuestionFeedback } from '../../components/question-feedback';
import { getQuizFeedback } from '../../actions/get-quiz-feedback';

interface QuizResultsPageProps {
  params: { id: string };
}

async function getQuizResults(quizId: string, userId: string) {
  const quizAttempt = await prisma.quizAttempt.findFirst({
    where: { quizId, userId },
    orderBy: { createdAt: 'desc' },
    include: {
      quiz: {
        include: {
          lesson: true,
          questions: {
            include: {
              quizAnswers: {
                where: {
                  quizAttempt: {
                    userId: userId
                  }
                },
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1
              }
            }
          },
        },
      },
      answers: true,
    },
  });

  if (!quizAttempt) {
    notFound();
  }

  return quizAttempt;
}

export async function generateMetadata(
  { params }: QuizResultsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { userId } = auth();
  if (!userId) throw new Error("Utilizator neautentificat");
  
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("Utilizator negăsit în baza de date");

  const quizResults = await getQuizResults(params.id, user.id);
  
  return {
    title: `Rezultate Quiz: ${quizResults.quiz.title} | BrightLearn`,
    description: `Vizualizează rezultatele și feedback-ul pentru quiz-ul "${quizResults.quiz.title}".`,
    openGraph: {
      title: `Rezultate Quiz: ${quizResults.quiz.title} | BrightLearn`,
      description: `Vizualizează rezultatele și feedback-ul pentru quiz-ul "${quizResults.quiz.title}".`,
      type: 'article',
    },
  };
}

export default async function QuizResultsPage({ params }: QuizResultsPageProps) {
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

  const quizResults = await getQuizResults(params.id, user.id);
  const feedback = await getQuizFeedback(quizResults.score, quizResults.quiz.title);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rezultate Quiz: {quizResults.quiz.title}</h1>
        <Button asChild>
          <Link href={`/quiz/${params.id}`}>Înapoi la Quiz</Link>
        </Button>
      </div>
      <p className="text-muted-foreground">Lecție: {quizResults.quiz.lesson.title}</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statistici</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Scor: {quizResults.score.toFixed(2)}%</p>
            <p>Răspunsuri corecte: {quizResults.correctAnswers}</p>
            <p>Răspunsuri greșite: {quizResults.wrongAnswers}</p>
            <p>Total întrebări: {quizResults.totalQuestions}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Grafic Rezultate</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizResultsChart
              correctAnswers={quizResults.correctAnswers}
              wrongAnswers={quizResults.wrongAnswers}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback General AI</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{feedback}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Detaliat pe Întrebări</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionFeedback 
            questions={quizResults.quiz.questions} 
            latestAttempt={quizResults}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button asChild>
          <Link href={`/quiz/${quizResults.quizId}`}>Înapoi la Quiz</Link>
        </Button>
        <Button asChild>
          <Link href="/quiz">Toate Quiz-urile</Link>
        </Button>
      </div>
    </div>
  );
}