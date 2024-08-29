// src/app/quiz/components/quiz-taking-form.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { submitQuizAnswers } from "../actions/submit-quiz-answers";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface QuizTakingFormProps {
  quizId: string;
  questions: Question[];
  timeLimit: number | null;
}

export function QuizTakingForm({ quizId, questions, timeLimit }: QuizTakingFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(timeLimit ? timeLimit * 60 : null);
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Shuffle options for the current question
  const shuffledOptions = React.useMemo(() => {
    return [...questions[currentQuestion].options].sort(
      () => Math.random() - 0.5
    );
  }, [currentQuestion, questions]);

  const handleAnswerChange = (value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitQuizAnswers(quizId, userAnswers);
      toast({
        title: "Quiz terminat",
        description:
          "Răspunsurile tale au fost înregistrate cu succes, se redirectioneaza catre rezultate, va rugam asteptati",
      });
      router.push(`/quiz/${quizId}/results`);
    } catch (error) {
      toast({
        title: "Eroare la trimiterea răspunsurilor",
        description: "A apărut o problemă. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-6">
      {timeRemaining !== null && (
        <div className="text-right">
          Timp rămas: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>
            Întrebarea {currentQuestion + 1} din {questions.length}
          </CardTitle>
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
        <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
          Anterior
        </Button>
        {currentQuestion < questions.length - 1 ? (
          <Button onClick={handleNext}>Următorul</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Se trimite..." : "Trimite răspunsurile"}
          </Button>
        )}
      </div>
    </div>
  );
}