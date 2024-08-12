// src/app/taguri/components/delete-tag-dialog.tsx
"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { deleteTag } from '../actions/delete-tag';
import { useRouter } from 'next/navigation';

interface DeleteTagDialogProps {
  tagId: string;
  tagName: string;
}

export function DeleteTagDialog({ tagId, tagName }: DeleteTagDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteTag(tagId);
      toast({ title: "Tag șters cu succes" });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({ title: "Eroare la ștergerea tagului", variant: "destructive" });
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
            Ești sigur că vrei să ștergi tagul "{tagName}"? Această acțiune nu poate fi anulată.
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