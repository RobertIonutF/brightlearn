// src/app/dashboard/components/time-progress-chart.tsx
"use client";

import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

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
  const monthlyData: MonthlyData = React.useMemo(() => {
    return quizAttempts.reduce((acc, attempt) => {
      const date = new Date(attempt.createdAt);
      const monthYear = `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = { correct: 0, total: 0 };
      }
      acc[monthYear].correct += attempt.correctAnswers;
      acc[monthYear].total += attempt.totalQuestions;
      return acc;
    }, {} as MonthlyData);
  }, [quizAttempts]);

  const data = React.useMemo(() => {
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthYear, { correct, total }]) => {
        const [year, month] = monthYear.split('-');
        return {
          name: `${monthNames[parseInt(month)]} ${year.slice(-2)}`,
          score: Math.round((correct / total) * 100),
        };
      });
  }, [monthlyData]);

  const chartConfig = {
    score: {
      label: "Scor",
      color: "var(--chart-1)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            tickFormatter={(value) => value.split(' ')[0]}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="var(--chart-1)" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}