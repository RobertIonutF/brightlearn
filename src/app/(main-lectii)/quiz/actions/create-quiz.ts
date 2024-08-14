// src/app/quiz/actions/create-quiz.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const questionSchema = z.object({
  questionText: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string(),
});

const quizSchema = z.object({
  questions: z.array(questionSchema),
});

const formSchema = z.object({
  lessonId: z.string(),
  language: z.enum(["ro", "en"]),
  difficulty: z.enum(['ușor', 'mediu', 'dificil']),
  questionCount: z.number().min(1).max(30),
});

export async function createQuiz(data: z.infer<typeof formSchema>) {
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

  const lesson = await prisma.lesson.findUnique({
    where: { id: data.lessonId },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  try {
    const result = await generateObject({
      model: openai('gpt-4o-2024-08-06', {
        structuredOutputs: true,
      }),
      schema: quizSchema,
      prompt: `Create a ${data.difficulty} quiz with ${data.questionCount} questions based on the following lesson content: "${lesson.content}" Language: ${data.language}`,
    });

    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz pentru ${lesson.title}`,
        lessonId: lesson.id,
        userId: user.id,
        questions: {
          create: result.object.questions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    revalidatePath('/quiz');
    return quiz;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw new Error("Failed to create quiz");
  }
}