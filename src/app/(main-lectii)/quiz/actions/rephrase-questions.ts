// src/app/quiz/actions/rephrase-questions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export async function rephraseQuestions(questions: Question[]): Promise<Question[]> {
  const rephrasedQuestions = await Promise.all(
    questions.map(async (question) => {
      const userId = await getUserId();
      const questionQuizzId = await prisma.question.findUnique({
        where: {
          id: question.id,
        },
        select: {
          quizId: true,
        },
      });

      const quizzLanguage = await prisma.quiz.findUnique({
        where: {
          id: questionQuizzId?.quizId,
        },
        select: {
          language: true,
        },
      });

      const prompt = `Reformulează următoarea întrebare într-un mod diferit, păstrând același sens și nivel de dificultate: "${question.questionText}" Language: ${quizzLanguage?.language}`;
      
      try {
        const result = await generateText({
          model: openai('gpt-4o-2024-08-06'), // You can change this to a different model if needed
          prompt: prompt,
        });

        return {
          ...question,
          questionText: result.text.trim(),
        };
      } catch (error) {
        console.error("Error rephrasing question:", error);
        return question; // Return the original question if there's an error
      }
    })
  );

  return rephrasedQuestions;
}