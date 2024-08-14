// src/app/quiz/components/quiz-table.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Quiz, Lesson } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Play, BarChart } from "lucide-react";

interface ExtendedQuiz extends Quiz {
  lesson: Lesson;
  _count?: {
    questions: number;
  };
}

interface QuizTableProps {
  quizzes: ExtendedQuiz[];
}

export function QuizTable({ quizzes }: QuizTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titlu Quiz</TableHead>
          <TableHead>Lecție Asociată</TableHead>
          <TableHead>Data Creării</TableHead>
          <TableHead>Întrebări</TableHead>
          <TableHead>Acțiuni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quizzes.map((quiz) => (
          <TableRow key={quiz.id}>
            <TableCell className="font-medium">{quiz.title}</TableCell>
            <TableCell>{quiz.lesson.title}</TableCell>
            <TableCell>{new Date(quiz.createdAt).toLocaleDateString('ro-RO')}</TableCell>
            <TableCell>{quiz._count?.questions ?? 'N/A'}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/quiz/${quiz.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> Vizualizează
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/quiz/${quiz.id}/start`}>
                    <Play className="mr-2 h-4 w-4" /> Începe
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/quiz/${quiz.id}/stats`}>
                    <BarChart className="mr-2 h-4 w-4" /> Statistici
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}