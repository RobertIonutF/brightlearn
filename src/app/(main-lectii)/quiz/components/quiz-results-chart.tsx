// src/app/quiz/components/quiz-results-chart.tsx
"use client";

import React from 'react';
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface QuizResultsChartProps {
  correctAnswers: number;
  wrongAnswers: number;
}

const chartConfig = {
  correct: {
    label: "Răspunsuri Corecte",
    color: "var(--chart-1)",
  },
  wrong: {
    label: "Răspunsuri Greșite",
    color: "var(--chart-2)",
  },
};

export function QuizResultsChart({ correctAnswers, wrongAnswers }: QuizResultsChartProps) {
  const data = [
    { name: "Răspunsuri", correct: correctAnswers, wrong: wrongAnswers },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="correct" fill="var(--chart-1)" stackId="stack" />
        <Bar dataKey="wrong" fill="var(--chart-2)" stackId="stack" />
      </BarChart>
    </ChartContainer>
  );
}