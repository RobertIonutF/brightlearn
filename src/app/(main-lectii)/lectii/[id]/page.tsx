// src/app/lectii/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
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

export default async function LessonPage({ params }: LessonPageProps) {
  const lesson = await getLesson(params.id);

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
        <Button className="flex items-center space-x-2">
          <Brain className="w-4 h-4" />
          <span>Învață cu AI</span>
        </Button>
        <Button className="flex items-center space-x-2">
          <FileQuestion className="w-4 h-4" />
          <span>Generează Quiz pentru această Lecție</span>
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
