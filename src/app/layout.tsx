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
    default: "MediLearn - Învățare Medicală Interactivă",
    template: "%s | MediLearn"
  },
  description: "Platformă de învățare medicală care transformă PDF-uri în lecții interactive și quiz-uri pentru studenți și profesioniști în domeniul medical.",
  keywords: ["învățare medicală", "educație medicală", "quiz medical", "studiu medical interactiv"],
  authors: [{ name: "MediLearn Team" }],
  creator: "MediLearn",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://medilearn.ro",
    title: "MediLearn - Învățare Medicală Interactivă",
    description: "Transformă studiul medical cu lecții interactive și quiz-uri personalizate.",
    siteName: "MediLearn",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediLearn - Învățare Medicală Interactivă",
    description: "Transformă studiul medical cu lecții interactive și quiz-uri personalizate.",
    creator: "@medilearn",
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