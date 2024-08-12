// src/app/categorii/components/edit-category-dialog.tsx
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { updateCategory } from '../actions/update-category';
import { Category } from '@prisma/client';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name: z.string().min(1, 'Numele categoriei este obligatoriu'),
});

type FormValues = z.infer<typeof schema>;

interface EditCategoryDialogProps {
  category: Category;
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: category.name },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await updateCategory({ id: category.id, name: data.name });
      toast({ title: "Categorie actualizată cu succes" });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Eroare la actualizarea categoriei", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editează</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editează categoria</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume Categorie</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Actualizează Categoria</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}