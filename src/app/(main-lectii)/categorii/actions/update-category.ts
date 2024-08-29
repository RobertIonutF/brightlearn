// src/app/categorii/actions/update-category.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import * as z from 'zod';

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Numele categoriei este obligatoriu'),
});

export async function updateCategory(data: z.infer<typeof schema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Neautorizat");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    throw new Error("Utilizator negăsit");
  }

  const validatedData = schema.parse(data);

  const category = await prisma.category.findUnique({
    where: { id: data.id },
    select: { userId: true },
  });

  if (!category || category.userId !== dbUser.id) {
    throw new Error("Nu aveți permisiunea de a șterge această categorie");
  }

  try {
    await prisma.category.update({
      where: { id: validatedData.id },
      data: { name: validatedData.name },
    });

    revalidatePath("/categorii");
  } catch (error) {
    console.error('Eroare la actualizarea categoriei:', error);
    throw new Error('Eroare la actualizarea categoriei');
  }
}