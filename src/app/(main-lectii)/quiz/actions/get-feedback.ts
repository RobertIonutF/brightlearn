// src/app/quiz/actions/get-feedback.ts
"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function getFeedback(score: number, lessonTitle: string): Promise<string> {
  const prompt = `Generează un feedback încurajator și constructiv pentru un student care a obținut un scor de ${score}% la un quiz despre "${lessonTitle}". Feedback-ul ar trebui să fie de aproximativ 2-3 propoziții, să felicite studentul pentru efort, să evidențieze importanța subiectului și să încurajeze îmbunătățirea continuă.`;

  try {
    const result = await generateText({
      model: openai('gpt-4o-2024-08-06'), // You can change this to a different model if needed
      prompt: prompt,
    });

    return result.text.trim();
  } catch (error) {
    console.error("Error generating feedback:", error);
    return "Ne pare rău, nu am putut genera un feedback personalizat în acest moment. Continuă să înveți și să te îmbunătățești!";
  }
}