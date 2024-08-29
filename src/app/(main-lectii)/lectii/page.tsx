// /src/app/lectii/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { LessonTable } from './components/lesson-table';
import { LessonCards } from './components/lesson-cards';
import { Pagination } from './components/pagination';
import { SearchAndFilter } from './components/search-and-filters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: 'Lecții | BrightLearn',
  description: 'Explorează lista ta de lecții interactive.',
  openGraph: {
    title: 'Lecții | BrightLearn',
    description: 'Explorează lista ta de lecții interactive.',
    type: 'website',
  },
};

const ITEMS_PER_PAGE = 10;

interface SearchParams {
  page?: string;
  search?: string;
  category?: string;
  tag?: string;
}

async function getLessons(userId: string, searchParams: SearchParams) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where = {
    userId: userId,
    title: searchParams.search ? { contains: searchParams.search, mode: 'insensitive' as const } : undefined,
    category: searchParams.category && searchParams.category !== 'all' ? { id: searchParams.category } : undefined,
    tags: searchParams.tag && searchParams.tag !== 'all'
      ? { 
          some: { 
            id: searchParams.tag,
          } 
        } 
      : undefined,
  };

  const [lessons, totalCount] = await Promise.all([
    prisma.lesson.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: true, category: true, tags: true },
      take: ITEMS_PER_PAGE,
      skip: skip,
    }),
    prisma.lesson.count({ where }),
  ]);

  return {
    lessons,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

async function getCategories(userId: string) {
  return prisma.category.findMany({ where: { userId } });
}

async function getTags(userId: string) {
  return prisma.tag.findMany({ where: { userId } });
}

export default async function LectiiPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  const { lessons, totalPages, currentPage } = await getLessons(user.id, searchParams);
  const categories = await getCategories(user.id);
  const tags = await getTags(user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Lecțiile Mele</h1>
      <SearchAndFilter categories={categories} tags={tags} />
      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table">Tabel</TabsTrigger>
          <TabsTrigger value="cards">Carduri</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <LessonTable lessons={lessons} />
        </TabsContent>
        <TabsContent value="cards">
          <LessonCards lessons={lessons} />
        </TabsContent>
      </Tabs>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}