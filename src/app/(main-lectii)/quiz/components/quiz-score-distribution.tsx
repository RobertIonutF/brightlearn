// src/app/quiz/components/quiz-score-distribution.tsx
"use client";

import React from 'react';
import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface QuizAttempt {
  score: number;
}

interface QuizScoreDistributionProps {
  attempts: QuizAttempt[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function QuizScoreDistribution({ attempts }: QuizScoreDistributionProps) {
  const distribution = attempts.reduce((acc, attempt) => {
    const score = attempt.score;
    if (score <= 20) acc['0-20']++;
    else if (score <= 40) acc['21-40']++;
    else if (score <= 60) acc['41-60']++;
    else if (score <= 80) acc['61-80']++;
    else acc['81-100']++;
    return acc;
  }, { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 });

  const data = Object.entries(distribution).map(([name, value]) => ({ name, value }));

  const chartConfig = Object.fromEntries(
    data.map((item, index) => [item.name, { label: `${item.name}%`, color: COLORS[index] }])
  );

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}