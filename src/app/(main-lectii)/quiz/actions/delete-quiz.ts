// src/app/quiz/actions/delete-quiz.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteQuiz(quizId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  //check if the quiz belongs to the user
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      userId: true,
    },
  });

  if (!quiz || quiz.userId !== user.id) {
    throw new Error("You don't have permission to delete this quiz");
  }

  try {
    // Delete the quiz and its associated questions
    await prisma.quiz.delete({
      where: {
        id: quizId,
        userId: user.id,
      },
    });

    revalidatePath('/quiz');
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw new Error("Error deleting quiz");
  }
}