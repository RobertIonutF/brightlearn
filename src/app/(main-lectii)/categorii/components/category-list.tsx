// src/app/categorii/components/category-list.tsx
"use client";

import React, { useState } from 'react';
import { Category } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteCategoryDialog } from './delete-category-dialog';
import { EditCategoryDialog } from './edit-category-dialog';
import { AddCategoryDialog } from '@/app/(main-lectii)/lectii/components/add-category-dialog';
import { useRouter } from 'next/navigation';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    router.push(`/categorii?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Caută categorii..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit">Caută</Button>
        </form>
        <AddCategoryDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nume Categorie</TableHead>
            <TableHead>Acțiuni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell className="space-x-2">
                <EditCategoryDialog category={category} />
                <DeleteCategoryDialog categoryId={category.id} categoryName={category.name} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}