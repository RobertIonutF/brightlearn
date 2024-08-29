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
import { deleteLesson } from '../actions/delete-lesson';

interface DeleteLessonButtonProps {
  lessonId: string;
  className?: string;
}

export function DeleteLessonButton({ lessonId, className }: DeleteLessonButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteLesson(lessonId);
      toast({
        title: "Lecție ștearsă cu succes",
        description: "Lecția a fost eliminată din sistem.",
      });
      router.push('/lectii');
    } catch (error) {
      toast({
        title: "Eroare la ștergerea lecției",
        description: "A apărut o problemă. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    }
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className={className}>
          <Trash2 className="mr-2 h-4 w-4" /> Șterge Lecția
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ești sigur că vrei să ștergi această lecție?</AlertDialogTitle>
          <AlertDialogDescription>
            Această acțiune nu poate fi anulată. Lecția va fi ștearsă permanent din sistem.
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