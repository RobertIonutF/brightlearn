// src/app/dashboard/components/overall-progress-chart.tsx
"use client";

import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface OverallProgressChartProps {
  quizAttempts: any[];
}

const chartConfig = {
  correct: {
    label: "Răspunsuri Corecte",
    color: "var(--chart-1)",
  },
  incorrect: {
    label: "Răspunsuri Incorecte",
    color: "var(--chart-2)",
  },
};

export function OverallProgressChart({ quizAttempts }: OverallProgressChartProps) {
  const data = quizAttempts.map((attempt, index) => ({
    name: `Quiz ${index + 1}`,
    correct: attempt.correctAnswers,
    incorrect: attempt.wrongAnswers,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="correct" stroke="var(--chart-1)" />
          <Line type="monotone" dataKey="incorrect" stroke="var(--chart-2)" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}