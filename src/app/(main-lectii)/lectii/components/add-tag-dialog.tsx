// /src/app/lectii/components/add-tag-dialog.tsx
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
import { createTag } from '../actions/create-tag';

const schema = z.object({
  name: z.string().min(1, 'Numele tag-ului este obligatoriu'),
});

type FormValues = z.infer<typeof schema>;

export function AddTagDialog({ onTagAdded }: { onTagAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createTag(data);
      toast({ title: "Tag adăugat cu succes" });
      form.reset();
      setOpen(false);
      onTagAdded();
    } catch (error) {
      toast({ title: "Eroare la adăugarea tag-ului", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Adaugă Tag</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă un nou tag</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume Tag</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduceți numele tag-ului" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Adaugă Tag</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}