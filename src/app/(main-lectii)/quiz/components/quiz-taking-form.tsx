// src/app/quiz/components/quiz-taking-form.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { submitQuizAnswers } from '../actions/submit-quiz-answers';

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface QuizTakingFormProps {
  quizId: string;
  questions: Question[];
}

export function QuizTakingForm({ quizId, questions }: QuizTakingFormProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  // Shuffle options for the current question
  const shuffledOptions = React.useMemo(() => {
    return [...questions[currentQuestion].options].sort(() => Math.random() - 0.5);
  }, [currentQuestion, questions]);

  const handleAnswerChange = (value: string) => {
    setUserAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitQuizAnswers(quizId, userAnswers);
      toast({
        title: "Quiz terminat",
        description: "Răspunsurile tale au fost înregistrate cu succes.",
      });
      router.push(`/quiz/${quizId}/results`);
    } catch (error) {
      toast({
        title: "Eroare la trimiterea răspunsurilor",
        description: "A apărut o problemă. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Întrebarea {currentQuestion + 1} din {questions.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{questions[currentQuestion].questionText}</p>
          <RadioGroup
            onValueChange={handleAnswerChange}
            value={userAnswers[questions[currentQuestion].id] || ""}
          >
            {shuffledOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Button onClick={handlePrevious} disabled={currentQuestion === 0}>Anterior</Button>
        {currentQuestion < questions.length - 1 ? (
          <Button onClick={handleNext}>Următorul</Button>
        ) : (
          <Button onClick={handleSubmit}>Finalizează Quiz</Button>
        )}
      </div>
    </div>
  );
}