// src/app/taguri/actions/delete-tag.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteTag(tagId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Neautorizat");
  }

  try {
    await prisma.tag.delete({
      where: { id: tagId },
    });

    revalidatePath("/taguri");
  } catch (error) {
    console.error('Eroare la ștergerea tagului:', error);
    throw new Error('Eroare la ștergerea tagului');
  }
}