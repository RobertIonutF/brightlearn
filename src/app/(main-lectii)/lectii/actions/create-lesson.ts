// src/app/lectii/actions/create-lesson.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function createLesson(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const tagIds = formData.getAll('tagIds') as string[];
  const content = formData.get('content') as string;
  const file = formData.get('file') as File | null;

  let fileUrl: string | null = null;

  if (file) {
    const fileRef = ref(storage, `lessons/${dbUser.id}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    fileUrl = await getDownloadURL(fileRef);
  }

  try {
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content: content as string,
        fileUrl,
        userId: dbUser.id,
        categoryId,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/lectii");
    return lesson;
  } catch (error) {
    console.error("Failed to create lesson:", error);
    throw new Error("Failed to create lesson");
  }
}