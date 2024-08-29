// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navbar } from "@/components/navbar/navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BrightLearn - Învățare Interactivă cu AI",
    template: "%s | BrightLearn"
  },
  description: "Platformă de învățare interactivă care transformă orice subiect în lecții interactive și quiz-uri cu ajutorul AI.",
  keywords: ["învățare interactivă", "educație online", "quiz-uri personalizate", "AI pentru învățare"],
  authors: [{ name: "BrightLearn Team" }],
  creator: "BrightLearn",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://brightlearn.ro",
    title: "BrightLearn - Învățare Interactivă cu AI",
    description: "Transformă modul în care înveți cu lecții interactive, chat AI și quiz-uri personalizate.",
    siteName: "BrightLearn",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrightLearn - Învățare Interactivă cu AI",
    description: "Transformă modul în care înveți cu lecții interactive, chat AI și quiz-uri personalizate.",
    creator: "@brightlearn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ro">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="container mx-auto py-6">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}