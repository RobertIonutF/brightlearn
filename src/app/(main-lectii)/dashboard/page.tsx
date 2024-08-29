// src/app/dashboard/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverallProgressChart } from './components/overall-progress-chart';
import { ScoreDistributionChart } from './components/score-distribution-chart';
import { CategoryPerformanceChart } from './components/category-performance-chart';
import { TagPerformanceChart } from './components/tag-performance-chart';
import { TimeProgressChart } from './components/time-progress-chart';
import { getOverallFeedback } from './actions/get-overall-feedback';

export const metadata = {
  title: 'Dashboard | BrightLearn',
  description: 'Vizualizează progresul tău general și statistici în BrightLearn.',
};

async function getDashboardData(userId: string) {
  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { userId },
    include: {
      quiz: {
        include: {
          lesson: {
            include: {
              category: true,
              tags: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  const overallCorrect = quizAttempts.reduce((sum, attempt) => sum + attempt.correctAnswers, 0);
  const overallTotal = quizAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);
  const overallScore = overallTotal > 0 ? (overallCorrect / overallTotal) * 100 : 0;

  return { quizAttempts, overallScore };
}

export default async function DashboardPage() {
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

  const { quizAttempts, overallScore } = await getDashboardData(user.id);
  const overallFeedback = await getOverallFeedback(overallScore, quizAttempts.length);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Score cards */}
        <Card className="col-span-full sm:col-span-1">
          <CardHeader>
            <CardTitle>Scor General</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold">{overallScore.toFixed(2)}%</p>
          </CardContent>
        </Card>
        <Card className="col-span-full sm:col-span-1">
          <CardHeader>
            <CardTitle>Total Quiz-uri</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold">{quizAttempts.length}</p>
          </CardContent>
        </Card>
        <Card className="col-span-full sm:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Feedback AI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{overallFeedback}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Progres în Timp</CardTitle>
          </CardHeader>
          <CardContent className="h-64 md:h-80">
            <TimeProgressChart quizAttempts={quizAttempts as any} />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Progres General</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <OverallProgressChart quizAttempts={quizAttempts} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Distribuția Scorurilor</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ScoreDistributionChart quizAttempts={quizAttempts} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Performanță pe Categorii</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <CategoryPerformanceChart quizAttempts={quizAttempts} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performanță pe Tag-uri</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <TagPerformanceChart quizAttempts={quizAttempts} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}