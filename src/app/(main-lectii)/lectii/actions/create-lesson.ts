"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import PdfParse from "pdf-parse";
import { PDFDocument } from "pdf-lib";
import { extractTextFromPPT } from "@/lib/ppt-extractor"; 

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

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const tagIds = formData.getAll("tagIds") as string[];
    let content = formData.get("content") as string;
    const file = formData.get("file") as File | null;

    if(!categoryId) {
      throw new Error("Categorie lipsă");
    }

    if(tagIds.length === 0) {
      throw new Error("Tag-uri lipsă");
    }

    console.log("Date primite:", {
      title,
      description,
      categoryId,
      tagIds,
      content: content ? "Conținut furnizat" : "Fără conținut",
      file: file ? file.name : "Fără fișier",
    });

    let fileUrl: string | null = null;

    if (file) {
      // Încarcă fișierul în Firebase
      const env = process.env.NODE_ENV === "production" ? "prod" : "dev";
      const fileRef = ref(
        storage,
        `${env}/lessons/${dbUser.id}/${Date.now()}_${file.name}`
      );
      const buffer = await file.arrayBuffer();
      await uploadBytes(fileRef, buffer);
      fileUrl = await getDownloadURL(fileRef);
      console.log("Fișier încărcat, URL:", fileUrl);

      try {
        const fileRetrieved = await fetch(fileUrl);

        if (!fileRetrieved.ok) {
          throw new Error(`Cod de stare HTTP: ${fileRetrieved.status}`);
        }

        const fileBuffer = await fileRetrieved.arrayBuffer();

        if (file.type === 'application/pdf') {
          const pdfDoc = await PDFDocument.load(buffer);
          const numPages = pdfDoc.getPageCount();

          if (numPages > 125) {
            throw new Error("PDF-ul are prea multe pagini (maxim 125)");
          }

          const pdfData = Buffer.from(fileBuffer);
          const pdfText = await PdfParse(pdfData);
          content = pdfText.text;
        } else if (
          file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
          file.type === 'application/vnd.ms-powerpoint'
        ) {
          content = await extractTextFromPPT(fileBuffer);
        } else {
          throw new Error("Tip de fișier neacceptat");
        }

        console.log("Text extras din fișier:", content);
      } catch (fileError) {
        console.error("Eroare la extragerea textului din fișier:", fileError);
        content = `Nu s-a putut extrage textul din fișier: ${file.name}. Eroare: ${fileError}`;

        // Șterge fișierul din Firebase dacă nu s-a putut extrage textul
        await deleteObject(fileRef);
        console.log("Fișier șters din Firebase:", fileUrl);

        throw new Error(
          "Nu s-a putut extrage textul din fișier: " + (fileError as Error).message
        );
      }
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content: content || "",
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