// src/app/quiz/[id]/stats/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizAttemptsChart } from '../../components/quiz-attempts-chart';
import { QuizScoreDistribution } from '../../components/quiz-score-distribution';
import { QuizQuestionPerformance } from '../../components/quiz-question-performance';
import { QuestionFeedback } from '../../components/question-feedback';
import { getQuizFeedback } from '../../actions/get-quiz-feedback';

export const metadata = {
  title: 'Statistici Quiz | MediLearn',
  description: 'Vizualizează statisticile și performanța pentru acest quiz.',
};

async function getQuizStats(quizId: string, userId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
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
      attempts: {
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          answers: {
            include: {
              question: true
            }
          }
        }
      },
    },
  });

  if (!quiz) {
    notFound();
  }

  return quiz;
}

export default async function QuizStatsPage({ params }: { params: { id: string } }) {
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

  const quizStats = await getQuizStats(params.id, user.id);
  const latestAttempt = quizStats.attempts[0];
  const feedback = latestAttempt 
    ? await getQuizFeedback(latestAttempt.score, quizStats.title)
    : "Nu există încă nicio încercare pentru acest quiz.";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Statistici Quiz: {quizStats.title}</h1>
        <Button asChild>
          <Link href={`/quiz/${params.id}`}>Înapoi la Quiz</Link>
        </Button>
      </div>
      <p className="text-muted-foreground">Lecție: {quizStats.lesson.title}</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Scor Cel Mai Recent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {latestAttempt ? `${latestAttempt.score.toFixed(2)}%` : 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Încercări</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{quizStats.attempts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feedback General AI</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{feedback}</p>
          </CardContent>
        </Card>
      </div>

      {quizStats.attempts.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Progres în Timp</CardTitle>
            </CardHeader>
            <CardContent>
              <QuizAttemptsChart attempts={quizStats.attempts as any} />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuția Scorurilor</CardTitle>
              </CardHeader>
              <CardContent>
                <QuizScoreDistribution attempts={quizStats.attempts} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performanță pe Întrebări</CardTitle>
              </CardHeader>
              <CardContent>
                <QuizQuestionPerformance questions={quizStats.questions} attempts={quizStats.attempts} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feedback Detaliat pe Întrebări</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionFeedback questions={quizStats.questions} latestAttempt={latestAttempt} />
            </CardContent>
          </Card>
        </>
      )}

      {quizStats.attempts.length === 0 && (
        <Card>
          <CardContent>
            <p className="text-center py-8">Nu există încă nicio încercare pentru acest quiz. Încercați să rezolvați quiz-ul pentru a vedea statisticile.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}