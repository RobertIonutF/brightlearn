// src/app/quiz/components/quiz-question-performance.tsx
"use client";

import React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface Question {
  id: string;
  questionText: string;
}

interface QuizAttempt {
  id: string;
  answers: {
    questionId: string;
    isCorrect: boolean;
  }[];
}

interface QuizQuestionPerformanceProps {
  questions: Question[];
  attempts: QuizAttempt[];
}

export function QuizQuestionPerformance({ questions, attempts }: QuizQuestionPerformanceProps) {
  const data = questions.map(question => {
    const totalAnswers = attempts.length;
    const correctAnswers = attempts.filter(attempt => 
      attempt.answers.some(answer => answer.questionId === question.id && answer.isCorrect)
    ).length;
    
    return {
      name: `Q${question.id.slice(-2)}`,
      correctPercentage: (correctAnswers / totalAnswers) * 100,
      questionText: question.questionText,
    };
  });

  const chartConfig = {
    correctPercentage: {
      label: "Procent Răspunsuri Corecte",
      color: "var(--chart-1)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="correctPercentage" fill="var(--chart-1)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}