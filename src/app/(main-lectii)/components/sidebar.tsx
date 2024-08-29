// src/components/sidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Book, List, PlusCircle, FileQuestion, Grid, Tag, BarChart } from 'lucide-react';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart },
  { href: '/lectii', label: 'Toate Lecțiile', icon: List },
  { href: '/lectii/create', label: 'Creare Lecție', icon: PlusCircle },
  { href: '/quiz', label: 'Quiz-uri', icon: FileQuestion },
  { href: '/categorii', label: 'Gestionare Categorii', icon: Grid },
  { href: '/taguri', label: 'Gestionare Taguri', icon: Tag },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-secondary w-full md:w-64 md:min-h-screen flex flex-col">
      <div className="p-4 border-b border-secondary-foreground/10">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">BrightLearn</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground hover:bg-secondary-foreground/10"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}