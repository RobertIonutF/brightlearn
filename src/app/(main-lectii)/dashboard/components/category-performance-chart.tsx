// src/app/dashboard/components/category-performance-chart.tsx
"use client";

import React from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

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
  const data = React.useMemo(() => {
    const categoryPerformance: CategoryPerformance = quizAttempts.reduce((acc, attempt) => {
      const category = attempt.quiz.lesson.category.name;
      if (!acc[category]) {
        acc[category] = { correct: 0, total: 0 };
      }
      acc[category].correct += attempt.correctAnswers;
      acc[category].total += attempt.totalQuestions;
      return acc;
    }, {} as CategoryPerformance);

    return Object.entries(categoryPerformance)
      .map(([name, { correct, total }]) => ({
        name,
        score: Math.round((correct / total) * 100),
      }))
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 5); // Limit to top 5 categories
  }, [quizAttempts]);

  const chartConfig = React.useMemo(() => {
    return Object.fromEntries(
      data.map((item, index) => [item.name, { label: item.name, color: `hsl(${index * 72}, 70%, 50%)` }])
    );
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={100}
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 10)}...` : value}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
          <Bar 
            dataKey="score" 
            fill="var(--chart-1)"
            label={{ position: 'right', fill: 'var(--foreground)', fontSize: 10 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}