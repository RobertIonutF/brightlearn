// src/app/lectii/components/search-and-filters.tsx
"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, Tag } from '@prisma/client';

interface SearchAndFilterProps {
  categories: Category[];
  tags: Tag[];
}

export function SearchAndFilter({ categories, tags }: SearchAndFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'all');

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    if (category && category !== 'all') params.set('category', category);
    else params.delete('category');
    if (selectedTag && selectedTag !== 'all') params.set('tag', selectedTag);
    else params.delete('tag');
    params.set('page', '1');  // Reset to first page on new search
    router.push(`/lectii?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setSelectedTag('all');
    router.push('/lectii');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="search">Caută lecții</Label>
          <Input
            id="search"
            placeholder="Caută lecții..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-[200px]">
          <Label htmlFor="category">Categorie</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Selectează categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate categoriile</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[200px]">
          <Label htmlFor="tag">Tag</Label>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger id="tag">
              <SelectValue placeholder="Selectează tag-ul" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate tag-urile</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end space-x-2">
          <Button onClick={handleSearch}>Caută</Button>
          <Button variant="outline" onClick={handleReset}>Resetează</Button>
        </div>
      </div>
    </div>
  );
}