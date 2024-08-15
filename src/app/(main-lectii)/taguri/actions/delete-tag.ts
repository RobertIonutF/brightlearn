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
  
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
    select: { userId: true },
  });

  if (!tag || tag.userId !== userId) {
    throw new Error("Nu aveți permisiunea de a șterge acest tag");
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