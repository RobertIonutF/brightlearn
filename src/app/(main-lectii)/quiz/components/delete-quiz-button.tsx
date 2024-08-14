// src/app/quiz/components/delete-quiz-button.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { deleteQuiz } from '../actions/delete-quiz';

interface DeleteQuizButtonProps {
  quizId: string;
}

export function DeleteQuizButton({ quizId }: DeleteQuizButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteQuiz(quizId);
      toast({
        title: "Quiz șters cu succes",
        description: "Quiz-ul a fost eliminat din sistem.",
      });
      router.push('/quiz');
    } catch (error) {
      toast({
        title: "Eroare la ștergerea quiz-ului",
        description: "A apărut o problemă. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    }
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Șterge Quiz-ul
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ești sigur că vrei să ștergi acest quiz?</AlertDialogTitle>
          <AlertDialogDescription>
            Această acțiune nu poate fi anulată. Quiz-ul va fi șters permanent din sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulează</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Șterge</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}