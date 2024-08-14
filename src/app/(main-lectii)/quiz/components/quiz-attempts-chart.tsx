// src/app/quiz/components/quiz-attempts-chart.tsx
"use client";

import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface QuizAttempt {
  id: string;
  score: number;
  createdAt: string;
}

interface QuizAttemptsChartProps {
  attempts: QuizAttempt[];
}

export function QuizAttemptsChart({ attempts }: QuizAttemptsChartProps) {
  const data = attempts.map((attempt, index) => ({
    name: `Încercare ${index + 1}`,
    score: attempt.score,
    date: new Date(attempt.createdAt).toLocaleDateString('ro-RO'),
  }));

  const chartConfig = {
    score: {
      label: "Scor",
      color: "var(--chart-1)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="var(--chart-1)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}