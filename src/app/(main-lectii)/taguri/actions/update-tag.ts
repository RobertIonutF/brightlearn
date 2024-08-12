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

  const validatedData = schema.parse(data);

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