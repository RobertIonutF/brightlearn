// /src/app/lectii/actions/create-lesson.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface CreateLessonData {
  title: string;
  description: string;
  content: string;
  categoryId: string;
  tagIds: string[];
}

export async function createLesson(data: CreateLessonData) {
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
    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        userId: dbUser.id,
        categoryId: data.categoryId,
        tags: {
          connect: data.tagIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/lectii");
    return lesson;
  } catch (error) {
    console.error("Failed to create lesson:", error);
    throw new Error("Failed to create lesson");
  }
}