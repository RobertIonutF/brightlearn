// src/app/quiz/actions/submit-quiz-answers.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function submitQuizAnswers(quizId: string, userAnswers: Record<string, string>) {
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
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    const totalQuestions = quiz.questions.length;
    let correctAnswers = 0;

    const answers = quiz.questions.map(question => {
      const isCorrect = userAnswers[question.id] === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      return {
        questionId: question.id,
        userAnswer: userAnswers[question.id],
        isCorrect,
      };
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId: user.id,
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers: totalQuestions - correctAnswers,
        answers: {
          create: answers,
        },
      },
    });

    revalidatePath(`/quiz/${quizId}`);
    
    // Return the quiz attempt ID instead of redirecting
    return { success: true, quizAttemptId: quizAttempt.id };
  } catch (error) {
    console.error("Error submitting quiz answers:", error);
    return { success: false, error: "Failed to submit quiz answers" };
  }
}