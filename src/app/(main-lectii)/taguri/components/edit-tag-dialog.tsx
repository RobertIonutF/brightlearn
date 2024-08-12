// src/app/taguri/components/edit-tag-dialog.tsx
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
import { updateTag } from '../actions/update-tag';
import { Tag } from '@prisma/client';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name: z.string().min(1, 'Numele tagului este obligatoriu'),
});

type FormValues = z.infer<typeof schema>;

interface EditTagDialogProps {
  tag: Tag;
}

export function EditTagDialog({ tag }: EditTagDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: tag.name },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await updateTag({ id: tag.id, name: data.name });
      toast({ title: "Tag actualizat cu succes" });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Eroare la actualizarea tagului", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editează</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editează tagul</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Actualizează Tag</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}