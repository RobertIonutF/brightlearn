// /src/app/lectii/create/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';
import { CreateLessonForm } from '../components/create-lesson-form';

export const metadata = {
  title: 'Creare Lecție | MediLearn',
  description: 'Creează o nouă lecție interactivă pentru platforma MediLearn.',
};

async function getCategories() {
  return prisma.category.findMany();
}

async function getTags() {
  return prisma.tag.findMany();
}

export default async function CreateLessonPage() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Creare Lecție Nouă</h1>
      <CreateLessonForm categories={categories} tags={tags} />
    </div>
  );
}