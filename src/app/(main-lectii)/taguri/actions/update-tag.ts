// src/app/taguri/actions/update-tag.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import * as z from 'zod';

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Numele tagului este obligatoriu'),
});

export async function updateTag(data: z.infer<typeof schema>) {
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

  const tag = await prisma.tag.findUnique({
    where: { id: data.id },
    select: { userId: true },
  });

  if (!tag || tag.userId !== dbUser.id) {
    throw new Error("Nu aveți permisiunea de a șterge acest tag");
  }

  try {
    await prisma.tag.update({
      where: { id: validatedData.id },
      data: { name: validatedData.name },
    });

    revalidatePath("/taguri");
  } catch (error) {
    console.error('Eroare la actualizarea tagului:', error);
    throw new Error('Eroare la actualizarea tagului');
  }
}