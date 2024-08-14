// src/app/quiz/actions/get-question-feedback.ts
"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function getQuestionFeedback(
  questionId: string,
  questionText: string,
  correctAnswer: string,
  userAnswer: string,
  isCorrect: boolean
): Promise<string> {
  const prompt = `Generează un feedback constructiv și educativ pentru un student care a răspuns la următoarea întrebare:

Întrebare: "${questionText}"
Răspunsul corect: "${correctAnswer}"
Răspunsul studentului: "${userAnswer}"
Rezultat: ${isCorrect ? 'Corect' : 'Incorect'}

Feedback-ul ar trebui să:
1. Înceapă cu o afirmație clară dacă răspunsul este corect sau incorect.
2. Pentru răspunsuri incorecte:
   - Explică de ce răspunsul studentului este incorect.
   - Oferă o explicație clară a răspunsului corect.
3. Pentru răspunsuri corecte:
   - Confirmă corectitudinea și oferă o scurtă explicație suplimentară.
4. Oferă informații suplimentare relevante pentru a ajuta la înțelegerea conceptului.
5. Încurajeze studentul să continue să învețe și să se îmbunătățească.
6. Fie concis, aproximativ 3-4 propoziții.

Asigură-te că feedbackul reflectă cu acuratețe dacă răspunsul studentului a fost corect sau incorect.`;

  try {
    const result = await generateText({
      model: openai('gpt-4'), // You can change this to a different model if needed
      prompt: prompt,
    });

    return result.text.trim();
  } catch (error) {
    console.error("Error generating question feedback:", error);
    throw new Error("Nu s-a putut genera feedback-ul. Vă rugăm să încercați din nou.");
  }
}