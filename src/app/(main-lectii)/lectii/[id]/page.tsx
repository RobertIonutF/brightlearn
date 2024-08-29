// src/app/lectii/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata, ResolvingMetadata } from 'next';
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Brain, FileQuestion } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@clerk/nextjs/server";
import { DeleteLessonButton } from '../components/delete-lesson-button';

interface LessonPageProps {
  params: { id: string };
}

async function getLesson(id: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { category: true, tags: true },
  });

  if (!lesson) notFound();

  return lesson;
}

export async function generateMetadata(
  { params }: LessonPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const lesson = await getLesson(params.id);
  
  return {
    title: `${lesson.title} | Your App Name`,
    description: lesson.description,
    openGraph: {
      title: lesson.title,
      description: lesson.description,
      type: 'article',
    },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const user = auth();
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.userId as string },
  });
  const lesson = await getLesson(params.id);
  if (lesson.userId !== dbUser?.id) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{lesson.description}</p>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button className="flex items-center space-x-2" asChild>
          <Link href={`/lectii/${lesson.id}/ai`}>
            <Brain className="w-4 h-4" />
            <span>Învață cu AI</span>
          </Link>
        </Button>
        <Button className="flex items-center space-x-2" asChild>
          <Link href={`/quiz/create?lessonId=${lesson.id}`}>
            <FileQuestion className="w-4 h-4" />
            <span>Generează Quiz pentru această Lecție</span>
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Conținut</TabsTrigger>
          <TabsTrigger value="details">Detalii</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <Card>
            <CardContent className="mt-4">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {lesson.content}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atribut</TableHead>
                    <TableHead>Valoare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Categorie</TableCell>
                    <TableCell>{lesson.category.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tag-uri</TableCell>
                    <TableCell>
                      {lesson.tags.map((tag) => tag.name).join(", ")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Data creării</TableCell>
                    <TableCell>
                      {new Date(lesson.createdAt).toLocaleDateString("ro-RO")}
                    </TableCell>
                  </TableRow>
                  {lesson.fileUrl && (
                    <TableRow>
                      <TableCell>Fișier atașat</TableCell>
                      <TableCell>
                        <a
                          href={lesson.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Vizualizează PDF
                        </a>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
