import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { QuizTable } from './components/quiz-table';
import { Pagination } from '@/components/ui/pagination';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: 'Quiz-uri | BrightLearn',
  description: 'Vizualizează și creează quiz-uri în aplicația MediLearn.',
  openGraph: {
    title: 'Quiz-uri | BrightLearn',
    description: 'Vizualizează și creează quiz-uri în aplicația MediLearn.',
    type: 'website',
  },
};

interface SearchParams {
  page?: string;
}

const ITEMS_PER_PAGE = 10;

async function getQuizzes(userId: string, searchParams: SearchParams) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [quizzes, totalCount] = await Promise.all([
    prisma.quiz.findMany({
      where: { userId },
      include: { 
        lesson: true,
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: ITEMS_PER_PAGE,
      skip,
    }),
    prisma.quiz.count({ where: { userId } }),
  ]);

  return {
    quizzes,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export default async function QuizListPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
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

  const { quizzes, totalPages, currentPage } = await getQuizzes(user.id, searchParams);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quiz-uri</h1>
        <Button asChild>
          <Link href="/quiz/create">
            <Plus className="mr-2 h-4 w-4" /> Creează Quiz Nou
          </Link>
        </Button>
      </div>
      
      {quizzes.length > 0 ? (
        <>
          <QuizTable quizzes={quizzes} />
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground mb-4">Nu ai creat încă niciun quiz.</p>
          <Button asChild>
            <Link href="/quiz/create">Creează Primul Tău Quiz</Link>
          </Button>
        </div>
      )}
    </div>
  );
}