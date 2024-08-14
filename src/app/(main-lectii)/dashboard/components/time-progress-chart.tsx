// src/app/dashboard/components/time-progress-chart.tsx
"use client";

import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface QuizAttempt {
  correctAnswers: number;
  totalQuestions: number;
  createdAt: string; // ISO date string
}

interface TimeProgressChartProps {
  quizAttempts: QuizAttempt[];
}

interface MonthlyData {
  [key: string]: {
    correct: number;
    total: number;
  };
}

const monthNames = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function TimeProgressChart({ quizAttempts }: TimeProgressChartProps) {
  const monthlyData: MonthlyData = quizAttempts.reduce((acc, attempt) => {
    const date = new Date(attempt.createdAt);
    const monthYear = `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { correct: 0, total: 0 };
    }
    acc[monthYear].correct += attempt.correctAnswers;
    acc[monthYear].total += attempt.totalQuestions;
    return acc;
  }, {} as MonthlyData);

  const data = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthYear, { correct, total }]) => {
      const [year, month] = monthYear.split('-');
      return {
        name: `${monthNames[parseInt(month)]} ${year}`,
        score: (correct / total) * 100,
      };
    });

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