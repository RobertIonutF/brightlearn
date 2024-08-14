"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function createLesson(formData: FormData) {
  try {
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

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const tagIds = formData.getAll('tagIds') as string[];
    let content = formData.get('content') as string;
    const file = formData.get('file') as File | null;

    console.log("Date primite:", { title, description, categoryId, tagIds, content: content ? 'Conținut furnizat' : 'Fără conținut', file: file ? file.name : 'Fără fișier' });

    let fileUrl: string | null = null;

    if (file) {
      // Încarcă fișierul în Firebase
      const env = process.env.NODE_ENV === "production" ? "prod" : "dev";
      const fileRef = ref(storage, `${env}/lessons/${dbUser.id}/${Date.now()}_${file.name}`);
      const buffer = await file.arrayBuffer();
      await uploadBytes(fileRef, buffer);
      fileUrl = await getDownloadURL(fileRef);
      console.log("Fișier încărcat, URL:", fileUrl); 

      // Extrage conținutul textual din PDF
      try {
        console.log(fileUrl);
      } catch (pdfError) {
        console.error("Eroare la extragerea textului din PDF:", pdfError);
        content = `Nu s-a putut extrage textul din PDF: ${file.name}. Eroare: ${pdfError}`;
      }
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content,
        fileUrl,
        categoryId,
        userId: dbUser.id,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });

    console.log("Lecție creată:", lesson);

    revalidatePath("/lectii");
    return lesson;
  } catch (error) {
    console.error("Nu s-a putut crea lecția:", error);
    throw new Error("Nu s-a putut crea lecția: " + (error as Error).message);
  }
}