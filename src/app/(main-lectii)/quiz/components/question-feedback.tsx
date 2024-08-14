// src/app/quiz/components/question-feedback.tsx
import { QuestionFeedbackClient } from './question-feedback-client';
import { getQuestionFeedback } from '../actions/get-question-feedback';

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

interface QuizAttempt {
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

interface QuestionFeedbackProps {
  questions: Question[];
  latestAttempt: QuizAttempt;
}

export function QuestionFeedback({ questions, latestAttempt }: QuestionFeedbackProps) {
  return (
    <QuestionFeedbackClient 
      questions={questions} 
      latestAttempt={latestAttempt} 
      getFeedback={getQuestionFeedback as any}
    />
  );
}