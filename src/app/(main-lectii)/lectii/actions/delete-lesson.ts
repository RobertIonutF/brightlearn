"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { storage } from "@/lib/firebase";
import { ref, deleteObject } from "firebase/storage";

export async function deleteLesson(lessonId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { userId: true, fileUrl: true },
  });

  if (!lesson || lesson.userId !== user.id) {
    throw new Error("You don't have permission to delete this lesson");
  }

  try {
    // Delete the associated file from Firebase Storage if it exists
    if (lesson.fileUrl) {
      const fileRef = ref(storage, lesson.fileUrl);
      await deleteObject(fileRef);
    }

    // Delete the lesson and its associated data
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    revalidatePath('/lectii');
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw new Error("Error deleting lesson");
  }
}