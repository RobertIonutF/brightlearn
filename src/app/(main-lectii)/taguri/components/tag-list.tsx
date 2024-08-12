// src/app/taguri/components/tag-list.tsx
"use client";

import React, { useState } from 'react';
import { Tag } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteTagDialog } from './delete-tag-dialog';
import { EditTagDialog } from './edit-tag-dialog';
import { AddTagDialog } from './add-tag-dialog';
import { useRouter } from 'next/navigation';

interface TagListProps {
  tags: Tag[];
}

export function TagList({ tags }: TagListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    router.push(`/taguri?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Caută taguri..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit">Caută</Button>
        </form>
        <AddTagDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nume Tag</TableHead>
            <TableHead>Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.name}</TableCell>
              <TableCell className="space-x-2">
                <EditTagDialog tag={tag} />
                <DeleteTagDialog tagId={tag.id} tagName={tag.name} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}