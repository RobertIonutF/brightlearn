// src/app/categorii/actions/delete-category.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteCategory(categoryId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Neautorizat");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { userId: true },
  });

  if (!category || category.userId !== userId) {
    throw new Error("Nu aveți permisiunea de a șterge această categorie");
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/categorii");
  } catch (error) {
    console.error("Eroare la ștergerea categoriei:", error);
    throw new Error("Eroare la ștergerea categoriei");
  }
}
