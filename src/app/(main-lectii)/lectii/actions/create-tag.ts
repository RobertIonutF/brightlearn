// /src/app/lectii/actions/create-tag.ts
"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

interface CreateTagData {
  name: string;
}

export async function createTag(data: CreateTagData) {
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
    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        userId: dbUser.id,
      },
    });

    revalidatePath("/lectii");
    return tag;
  } catch (error) {
    console.error('Failed to create tag:', error);
    throw new Error('Failed to create tag');
  }
}