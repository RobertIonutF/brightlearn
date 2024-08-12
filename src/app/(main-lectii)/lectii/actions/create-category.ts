// /src/app/lectii/actions/create-category.ts
"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

interface CreateCategoryData {
  name: string;
}

export async function createCategory(data: CreateCategoryData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        userId: dbUser.id,
      },
    });

    revalidatePath("/lectii");
    return category;
  } catch (error) {
    console.error('Failed to create category:', error);
    throw new Error('Failed to create category');
  }
}