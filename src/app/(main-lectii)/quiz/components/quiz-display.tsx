// src/app/quiz/components/quiz-display.tsx
"use client";

import React from 'react';
import { Quiz, Question } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface QuizDisplayProps {
  quiz: Quiz & { questions: Question[] };
}

export function QuizDisplay({ quiz }: QuizDisplayProps) {
  return (
    <div className="space-y-6">
      {quiz.questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle>Întrebarea {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{question.questionText}</p>
            <RadioGroup>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q${index}-option${optionIndex}`} />
                  <Label htmlFor={`q${index}-option${optionIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}