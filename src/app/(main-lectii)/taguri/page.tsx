// src/app/taguri/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { TagList } from './components/tag-list';
import { Pagination } from '@/components/ui/pagination';

export const metadata = {
  title: 'Gestionare Taguri | MediLearn',
  description: 'Gestionează tagurile pentru lecțiile tale în aplicația MediLearn.',
};

interface SearchParams {
  page?: string;
  search?: string;
}

const ITEMS_PER_PAGE = 10;

async function getTags(userId: string, searchParams: SearchParams) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where = {
    userId,
    name: searchParams.search ? { contains: searchParams.search, mode: 'insensitive' as const } : undefined,
  };

  const [tags, totalCount] = await Promise.all([
    prisma.tag.findMany({
      where,
      orderBy: { name: 'asc' },
      take: ITEMS_PER_PAGE,
      skip,
    }),
    prisma.tag.count({ where }),
  ]);

  return {
    tags,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export default async function TagsPage({
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

  const { tags, totalPages, currentPage } = await getTags(user.id, searchParams);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestionare Taguri</h1>
      <TagList tags={tags} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}