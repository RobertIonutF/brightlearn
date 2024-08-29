// src/app/dashboard/components/tag-performance-chart.tsx
"use client";

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface QuizAttempt {
  correctAnswers: number;
  totalQuestions: number;
  quiz: {
    lesson: {
      tags: Array<{ name: string }>;
    };
  };
}

interface TagPerformanceChartProps {
  quizAttempts: QuizAttempt[];
}

interface TagPerformance {
  [key: string]: {
    correct: number;
    total: number;
  };
}

export function TagPerformanceChart({ quizAttempts }: TagPerformanceChartProps) {
  const tagPerformance: TagPerformance = React.useMemo(() => {
    return quizAttempts.reduce((acc, attempt) => {
      attempt.quiz.lesson.tags.forEach(tag => {
        if (!acc[tag.name]) {
          acc[tag.name] = { correct: 0, total: 0 };
        }
        acc[tag.name].correct += attempt.correctAnswers;
        acc[tag.name].total += attempt.totalQuestions;
      });
      return acc;
    }, {} as TagPerformance);
  }, [quizAttempts]);

  const data = React.useMemo(() => {
    return Object.entries(tagPerformance)
      .map(([name, { correct, total }]) => ({
        subject: name,
        score: Math.round((correct / total) * 100),
      }))
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, 8); // Limit to top 8 tags
  }, [tagPerformance]);

  const chartConfig = React.useMemo(() => {
    return Object.fromEntries(
      data.map((item, index) => [item.subject, { label: item.subject, color: `hsl(${index * 45}, 70%, 50%)` }])
    );
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fontSize: 10, fill: 'var(--foreground)' }}
            tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 8)}...` : value}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: 'var(--foreground)' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Radar 
            name="Score" 
            dataKey="score" 
            stroke="var(--chart-1)" 
            fill="var(--chart-1)" 
            fillOpacity={0.6} 
          />
          <ChartTooltip content={<ChartTooltipContent />} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}