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
  title: z.string().min(1, "Titlul este obligatoriu"),
  lessonId: z.string(),
  language: z.enum(["ro", "en"]),
  difficulty: z.enum(['ușor', 'mediu', 'dificil']),
  timeLimit: z.number().min(0).max(30),
  questionCount: z.number().min(1).max(50),
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

  if(data.questionCount > 49 || data.questionCount < 5) {
    throw new Error("Numărul maxim de întrebări este 50, iar minimul este 5");
  }

  //check if the lesson belongs to the user
  const ownershipCheck = await prisma.lesson.findUnique({
    where: {
      id: data.lessonId,
    },
    select: {
      userId: true,
    },
  });

  if (!ownershipCheck || ownershipCheck.userId !== user.id) {
    throw new Error("You don't have permission to create a quiz for this lesson");
  }

  try {
    const result = await generateObject({
      model: openai('gpt-4o-2024-08-06', {
        structuredOutputs: true,
      }),
      schema: quizSchema,
      prompt: `Create a ${data.difficulty} quiz with ${data.questionCount} questions based on the following lesson content: "${lesson.content}" Language: ${data.language} for a time limit of ${data.timeLimit !== 0 ? data.timeLimit : "unlimited"} minutes`,
    });

    const quiz = await prisma.quiz.create({
      data: {
        title: data?.title,
        lessonId: lesson.id,
        userId: user.id,
        language: data.language,
        timeLimit: data.timeLimit !== 0 ? data.timeLimit : null,
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