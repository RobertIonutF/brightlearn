// src/app/dashboard/components/category-performance-chart.tsx
"use client";

import React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface QuizAttempt {
  correctAnswers: number;
  totalQuestions: number;
  quiz: {
    lesson: {
      category: {
        name: string;
      };
    };
  };
}

interface CategoryPerformanceChartProps {
  quizAttempts: QuizAttempt[];
}

interface CategoryPerformance {
  [key: string]: {
    correct: number;
    total: number;
  };
}

export function CategoryPerformanceChart({ quizAttempts }: CategoryPerformanceChartProps) {
  const categoryPerformance: CategoryPerformance = quizAttempts.reduce((acc, attempt) => {
    const category = attempt.quiz.lesson.category.name;
    if (!acc[category]) {
      acc[category] = { correct: 0, total: 0 };
    }
    acc[category].correct += attempt.correctAnswers;
    acc[category].total += attempt.totalQuestions;
    return acc;
  }, {} as CategoryPerformance);

  const data = Object.entries(categoryPerformance).map(([name, { correct, total }]) => ({
    name,
    score: (correct / total) * 100,
  }));

  const chartConfig = Object.fromEntries(
    data.map((item, index) => [item.name, { label: item.name, color: `hsl(${index * 30}, 70%, 50%)` }])
  );

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="score" fill="var(--chart-1)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}