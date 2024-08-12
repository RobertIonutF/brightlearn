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
