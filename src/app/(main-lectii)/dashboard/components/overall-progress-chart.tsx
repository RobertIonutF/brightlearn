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
  const data = React.useMemo(() => {
    return quizAttempts
      .slice(-10) // Only show the last 10 attempts
      .map((attempt, index) => ({
        name: `Q${quizAttempts.length - 9 + index}`,
        correct: attempt.correctAnswers,
        incorrect: attempt.wrongAnswers,
      }));
  }, [quizAttempts]);

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            width={30}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend 
            wrapperStyle={{ fontSize: 12, paddingTop: '10px' }}
            verticalAlign="bottom"
            height={36}
          />
          <Line 
            type="monotone" 
            dataKey="correct" 
            stroke="var(--chart-1)" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="incorrect" 
            stroke="var(--chart-2)" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}