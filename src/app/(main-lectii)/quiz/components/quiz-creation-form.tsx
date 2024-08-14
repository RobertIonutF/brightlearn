// src/app/quiz/components/quiz-creation-form.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { createQuiz } from "../actions/create-quiz";

const formSchema = z.object({
  language: z.enum(["ro", "en"]),
  lessonId: z.string().min(1, "Selectați o lecție"),
  difficulty: z.enum(["ușor", "mediu", "dificil"]),
  questionCount: z.number().min(1).max(30),
});

type FormValues = z.infer<typeof formSchema>;

interface LessonOption {
  id: string;
  title: string;
}

interface QuizCreationFormProps {
  lessons: LessonOption[];
  selectedLessonId?: string;
}

export function QuizCreationForm({
  lessons,
  selectedLessonId,
}: QuizCreationFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "ro",
      lessonId: selectedLessonId || "",
      difficulty: "mediu",
      questionCount: 10,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const quiz = await createQuiz(data);
      toast({
        title: "Quiz creat cu succes",
        description: "Redirectare către pagina quiz-ului...",
      });
      router.push(`/quiz/${quiz.id}`);
    } catch (error) {
      toast({
        title: "Eroare la crearea quiz-ului",
        description: "Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {!selectedLessonId && (
          <FormField
            control={form.control}
            name="lessonId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lecție</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează o lecție" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selectați lecția pentru care doriți să creați quiz-ul.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limbă</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează limba" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ro">Română</SelectItem>
                  <SelectItem value="en">Engleză</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Selectați limba în care doriți să fie generate întrebările.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dificultate</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează dificultatea" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ușor">Ușor</SelectItem>
                  <SelectItem value="mediu">Mediu</SelectItem>
                  <SelectItem value="dificil">Dificil</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Selectează nivelul de dificultate al întrebărilor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="questionCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Număr de întrebări</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  min={1}
                  max={30}
                />
              </FormControl>
              <FormDescription>
                Selectează numărul de întrebări pentru quiz (între 1 și 5).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Generează Quiz</Button>
      </form>
    </Form>
  );
}
