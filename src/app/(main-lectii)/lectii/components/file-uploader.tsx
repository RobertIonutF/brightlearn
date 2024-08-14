// src/app/lectii/components/file-uploader.tsx
"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onChange: (files: FileList) => void;
}

export function FileUploader({ onChange }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const fileList = Object.assign(acceptedFiles, {
      item: (index: number) => acceptedFiles[index],
    });
    onChange(fileList as unknown as FileList);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-md p-6 text-center cursor-pointer",
        isDragActive ? "border-primary" : "border-muted-foreground"
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Glisați fișierul PDF aici...</p>
      ) : (
        <p>Glisați și plasați un fișier PDF aici, sau faceți clic pentru a selecta un fișier</p>
      )}
    </div>
  );
}