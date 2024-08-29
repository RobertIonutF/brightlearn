// src/app/taguri/actions/create-tag.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Numele tagului este obligatoriu'),
});

export async function createTag(data: z.infer<typeof schema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Neautorizat");
  }
  const validatedData = schema.parse(data);

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    throw new Error("Utilizator negăsit");
  }

  try {
    const newTag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        userId: dbUser.id,
      },
    });

    revalidatePath("/taguri");
    return newTag;
  } catch (error) {
    console.error('Eroare la crearea tagului:', error);
    throw new Error('Eroare la crearea tagului');
  }
}