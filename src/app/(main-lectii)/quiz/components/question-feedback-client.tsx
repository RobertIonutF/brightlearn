// src/app/quiz/components/question-feedback-client.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  quizAnswers: {
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

interface QuizAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

interface QuizAttempt {
  answers: QuizAnswer[];
}

interface QuestionFeedbackClientProps {
  questions: Question[];
  latestAttempt: QuizAttempt;
  getFeedback: (questionId: string, questionText: string, correctAnswer: string, userAnswer: string, isCorrect: boolean) => Promise<string>;
}

interface FeedbackState {
  feedback: string;
  isLoading: boolean;
  error: string | null;
}

type FeedbacksState = Record<string, FeedbackState>;

export function QuestionFeedbackClient({ questions, latestAttempt, getFeedback }: QuestionFeedbackClientProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbacksState>({});

  const fetchFeedback = useCallback(async (questionId: string, question: Question, latestAnswer: QuizAnswer) => {
    setFeedbacks(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], isLoading: true, error: null }
    }));

    try {
      const isCorrect = question.correctAnswer.trim().toLowerCase() === latestAnswer.userAnswer.trim().toLowerCase();
      const feedback = await getFeedback(
        questionId,
        question.questionText,
        question.correctAnswer,
        latestAnswer.userAnswer,
        isCorrect
      );
      setFeedbacks(prev => ({
        ...prev,
        [questionId]: { feedback, isLoading: false, error: null }
      }));
    } catch (error) {
      setFeedbacks(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], isLoading: false, error: "Eroare la încărcarea feedback-ului." }
      }));
    }
  }, [getFeedback]);

  useEffect(() => {
    questions.forEach(question => {
      const latestAnswer = latestAttempt.answers.find(a => a.questionId === question.id);
      if (latestAnswer) {
        fetchFeedback(question.id, question, latestAnswer);
      }
    });
  }, [questions, latestAttempt, fetchFeedback]);

  return (
    <div className="space-y-4">
      {questions.map((question) => {
        const latestAnswer = latestAttempt.answers.find(a => a.questionId === question.id);
        const feedbackState = feedbacks[question.id] || { isLoading: true, error: null, feedback: '' };
        const isCorrect = latestAnswer && question.correctAnswer.trim().toLowerCase() === latestAnswer.userAnswer.trim().toLowerCase();
        
        return (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>Întrebarea: {question.questionText}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Răspunsul tău: {latestAnswer?.userAnswer || 'N/A'}</p>
              <p>Răspuns corect: {question.correctAnswer}</p>
              <p>Rezultat: {isCorrect ? 'Corect' : 'Incorect'}</p>
              <p className="mt-2 font-semibold">Feedback AI:</p>
              {feedbackState.isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se încarcă...
                </div>
              ) : feedbackState.error ? (
                <div>
                  <p className="text-red-500">{feedbackState.error}</p>
                  <Button 
                    onClick={() => latestAnswer && fetchFeedback(question.id, question, latestAnswer)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Încearcă din nou
                  </Button>
                </div>
              ) : (
                <p>{feedbackState.feedback}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}