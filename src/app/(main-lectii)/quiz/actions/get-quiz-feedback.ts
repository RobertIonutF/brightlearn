// src/app/quiz/actions/get-quiz-feedback.ts
"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function getQuizFeedback(score: number, quizTitle: string): Promise<string> {
  const prompt = `Generează un feedback constructiv și încurajator pentru un student care a obținut un scor de ${score}% la quiz-ul "${quizTitle}". Feedback-ul ar trebui să:

1. Menționeze explicit scorul obținut.
2. Ofere o evaluare generală a performanței (ex: excelent, bine, necesită îmbunătățiri).
3. Încurajeze studentul să continue să învețe și să se îmbunătățească.
4. Ofere sugestii generale pentru îmbunătățirea performanței în viitor.
5. Fie concis, aproximativ 3-4 propoziții.`;

  try {
    const result = await generateText({
      model: openai('gpt-4o-2024-08-06'), // You can change this to a different model if needed
      prompt: prompt,
    });

    return result.text.trim();
  } catch (error) {
    console.error("Error generating quiz feedback:", error);
    throw new Error("Nu s-a putut genera feedback-ul general pentru quiz. Vă rugăm să încercați din nou.");
  }
}