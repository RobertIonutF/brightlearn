// src/app/dashboard/actions/get-overall-feedback.ts
"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function getOverallFeedback(overallScore: number, totalQuizzes: number): Promise<string> {
  const prompt = `Generează un feedback încurajator și constructiv pentru un student care are un scor general de ${overallScore.toFixed(2)}% după ${totalQuizzes} quiz-uri completate. Feedback-ul ar trebui să fie de aproximativ 3-4 propoziții, să felicite studentul pentru efort, să evidențieze importanța învățării continue și să ofere sugestii generale pentru îmbunătățire. Încurajează studentul să continue să folosească platforma pentru a-și îmbunătăți cunoștințele.`;

  try {
    const result = await generateText({
      model: openai('gpt-4'), // You can change this to a different model if needed
      prompt: prompt,
    });

    return result.text.trim();
  } catch (error) {
    console.error("Error generating overall feedback:", error);
    return "Ne pare rău, nu am putut genera un feedback personalizat în acest moment. Continuă să înveți și să te îmbunătățești folosind platforma noastră!";
  }
}