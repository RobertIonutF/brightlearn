// src/app/categorii/components/delete-category-dialog.tsx
"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { deleteCategory } from '../actions/delete-category';
import { useRouter } from 'next/navigation';

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
}

export function DeleteCategoryDialog({ categoryId, categoryName }: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteCategory(categoryId);
      toast({ title: "Categorie ștearsă cu succes" });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Eroare la ștergerea categoriei", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Șterge</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmă ștergerea</DialogTitle>
          <DialogDescription>
            Ești sigur că vrei să ștergi categoria &qout;{categoryName}&qout;? Această acțiune nu poate fi anulată.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Anulează</Button>
          <Button variant="destructive" onClick={handleDelete}>Șterge</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}