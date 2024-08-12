// /src/app/lectii/components/lesson-table.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Lesson, User, Category, Tag } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LessonTableProps {
  lessons: (Lesson & { user: User; category: Category; tags: Tag[] })[];
}

export function LessonTable({ lessons }: LessonTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titlu</TableHead>
          <TableHead>Descriere</TableHead>
          <TableHead>Categorie</TableHead>
          <TableHead>Tag-uri</TableHead>
          <TableHead>Data Creării</TableHead>
          <TableHead>Acțiuni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lessons.map((lesson) => (
          <TableRow key={lesson.id}>
            <TableCell>{lesson.title}</TableCell>
            <TableCell>{lesson.description}</TableCell>
            <TableCell>{lesson.category.name}</TableCell>
            <TableCell>
              {lesson.tags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="mr-1">
                  {tag.name}
                </Badge>
              ))}
            </TableCell>
            <TableCell>{new Date(lesson.createdAt).toLocaleDateString('ro-RO')}</TableCell>
            <TableCell>
              <Button asChild>
                <Link href={`/lectii/${lesson.id}`}>Vezi Lecția</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}