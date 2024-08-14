"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { createLesson } from "../actions/create-lesson";
import { Category, Tag } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "./file-uploader";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const lessonSchema = z.object({
  title: z
    .string()
    .min(1, "Titlul este obligatoriu")
    .max(255, "Titlul este prea lung"),
  description: z
    .string()
    .min(1, "Descrierea este obligatorie")
    .max(1000, "Descrierea este prea lungă"),
  content: z.string().min(1, "Conținutul este obligatoriu"),
  categoryId: z.string().min(1, "Categoria este obligatorie"),
  tagIds: z.array(z.string()).min(1, "Selectați cel puțin un tag"),
  file: z
    .custom<File>((file) => file instanceof File, "Invalid file")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "Dimensiunea maximă a fișierului este de 100MB"
    )
    .optional(),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface CreateLessonFormProps {
  categories: Category[];
  tags: Tag[];
}

export function CreateLessonForm({ categories, tags }: CreateLessonFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      categoryId: "",
      tagIds: [],
      file: undefined,
    },
  });

  const onSubmit = async (data: LessonFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("categoryId", data.categoryId);
      data.tagIds.forEach((tagId) => formData.append("tagIds", tagId));

      if (activeTab === "text") {
        formData.append("content", data.content);
      } else if (data.file) {
        formData.append("file", data.file);
      }

      await createLesson(formData);

      toast({
        title: "Lecție creată cu succes",
        description: "Noua lecție a fost adăugată în sistem.",
      });
      router.push("/lectii");
    } catch (error) {
      toast({
        title: "Eroare la crearea lecției",
        description: "A apărut o problemă. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titlu</FormLabel>
              <FormControl>
                <Input placeholder="Introduceți titlul lecției" {...field} />
              </FormControl>
              <FormDescription>Titlul lecției tale</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descriere</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Introduceți o scurtă descriere a lecției"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                O scurtă descriere a conținutului lecției
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "text" | "file")}
        >
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="file">Fișier PDF</TabsTrigger>
          </TabsList>
          <TabsContent value="text">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conținut</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Introduceți conținutul lecției"
                      {...field}
                      className="min-h-[200px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Conținutul complet al lecției
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="file">
            <Controller
              name="file"
              control={form.control}
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Încărcare fișier PDF</FormLabel>
                  <FormControl>
                    <FileUploader
                      {...field}
                      onChange={(file) => {
                        onChange(file);
                        if (file) {
                          form.setValue(
                            "content",
                            "PDF content will be extracted"
                          );
                        } else {
                          form.setValue("content", "");
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Încărcați un fișier PDF cu conținutul lecției
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează o categorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Categoria lecției</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag-uri</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) =>
                    field.onChange([...field.value, value])
                  }
                  value=""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează tag-uri" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <div className="mt-2 flex flex-wrap gap-2">
                {field.value.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId);
                  return tag ? (
                    <Button
                      key={tag.id}
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        field.onChange(field.value.filter((id) => id !== tagId))
                      }
                    >
                      {tag.name} &#x2715;
                    </Button>
                  ) : null;
                })}
              </div>
              <FormDescription>
                Selectează tag-urile relevante pentru lecție
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Se creează..." : "Creează Lecția"}
        </Button>
      </form>
    </Form>
  );
}