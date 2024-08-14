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
    throw new Error("Failed to delete quiz");
  }
}