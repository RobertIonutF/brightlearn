// src/app/dashboard/components/score-distribution-chart.tsx
"use client";

import React from 'react';
import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ScoreDistributionChartProps {
  quizAttempts: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const chartConfig = {
  '0-20': { label: '0-20%', color: COLORS[0] },
  '21-40': { label: '21-40%', color: COLORS[1] },
  '41-60': { label: '41-60%', color: COLORS[2] },
  '61-80': { label: '61-80%', color: COLORS[3] },
  '81-100': { label: '81-100%', color: COLORS[4] },
};

export function ScoreDistributionChart({ quizAttempts }: ScoreDistributionChartProps) {
  const distribution: Record<string, number> = React.useMemo(() => {
    return quizAttempts.reduce((acc, attempt) => {
      const score = (attempt.correctAnswers / attempt.totalQuestions) * 100;
      if (score <= 20) acc['0-20']++;
      else if (score <= 40) acc['21-40']++;
      else if (score <= 60) acc['41-60']++;
      else if (score <= 80) acc['61-80']++;
      else acc['81-100']++;
      return acc;
    }, { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 });
  }, [quizAttempts]);

  const data = React.useMemo(() => {
    return Object.entries(distribution)
      .map(([name, value]): { name: string; value: number } => ({ name, value }))
      .filter(item => item.value > 0); // Only include non-zero values
  }, [distribution]);

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="80%"
            innerRadius="40%"
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}