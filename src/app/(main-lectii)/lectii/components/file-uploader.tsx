// src/app/lectii/components/file-uploader.tsx
"use client";

import React, { useCallback, useState, forwardRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { File, X } from "lucide-react";

interface FileUploaderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (file: File | null) => void;
}

export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ onChange, ...props }, ref) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        onChange(selectedFile);
      }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'application/vnd.ms-powerpoint': ['.ppt'],
      },
      maxFiles: 1,
    });

    const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setFile(null);
      onChange(null);
    };

    return (
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md p-6 text-center cursor-pointer",
          isDragActive ? "border-primary" : "border-muted-foreground"
        )}
      >
        <input {...getInputProps()} ref={ref} {...props} />
        {file ? (
          <div className="flex items-center justify-center space-x-2">
            <File className="w-8 h-8 text-primary" />
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : isDragActive ? (
          <p>Glisați fișierul PDF sau PPT aici...</p>
        ) : (
          <p>Glisați și plasați un fișier PDF sau PPT aici, sau faceți clic pentru a selecta un fișier</p>
        )}
      </div>
    );
  }
);

FileUploader.displayName = 'FileUploader';