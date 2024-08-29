// /src/app/lectii/layout.tsx
import React from 'react';
import { Sidebar } from './components/sidebar';

export default function LectiiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}