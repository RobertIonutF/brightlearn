// src/app/despre/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { BookOpen, Brain, FileQuestion, Zap } from 'lucide-react';

export const metadata = {
  title: 'Despre MediLearn | Platforma de Învățare Medicală',
  description: 'Descoperiți MediLearn - platforma inovatoare de e-learning pentru studenți și profesioniști în medicină. Învățare personalizată, quiz-uri interactive și asistență AI.',
};

const features = [
  {
    icon: <BookOpen className="w-10 h-10 text-primary" />,
    title: "Lecții Interactive",
    description: "Acces la o varietate de lecții medicale structurate și interactive pentru o învățare eficientă."
  },
  {
    icon: <FileQuestion className="w-10 h-10 text-primary" />,
    title: "Quiz-uri Personalizate",
    description: "Testați-vă cunoștințele cu quiz-uri generate automat, adaptate conținutului fiecărei lecții."
  },
  {
    icon: <Brain className="w-10 h-10 text-primary" />,
    title: "Asistent AI",
    description: "Beneficiați de ajutorul unui asistent AI avansat pentru a răspunde la întrebări și a clarifica concepte complexe."
  },
  {
    icon: <Zap className="w-10 h-10 text-primary" />,
    title: "Învățare Adaptivă",
    description: "Sistem de învățare care se adaptează la nevoile și progresul fiecărui utilizator."
  }
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Despre MediLearn</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          MediLearn este platforma inovatoare de e-learning dedicată studenților și profesioniștilor în medicină, 
          oferind o experiență de învățare personalizată și interactivă.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Misiunea Noastră</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Misiunea MediLearn este de a revoluționa educația medicală prin tehnologie avansată și metode de învățare inovatoare. 
              Ne propunem să oferim acces la resurse educaționale de înaltă calitate, să facilităm învățarea personalizată 
              și să pregătim viitoarea generație de profesioniști în domeniul medical.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Viziunea Noastră</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Vizăm să devenim liderul global în educația medicală online, creând o comunitate de învățare vibrantă și 
              oferind instrumente educaționale care să îmbunătățească semnificativ calitatea îngrijirii pacienților prin 
              pregătirea exemplară a profesioniștilor din domeniul medical.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Caracteristici Principale</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <CardTitle className="text-center">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Începeți Călătoria Educațională</h2>
        <p className="mb-6 text-lg">
          Fie că sunteți student la medicină, rezident sau profesionist în domeniul medical, 
          MediLearn vă oferă resursele și instrumentele necesare pentru a excela în cariera dumneavoastră.
        </p>
        <Button asChild size="lg">
          <Link href="/sign-up">Înregistrați-vă Gratuit</Link>
        </Button>
      </section>
    </div>
  );
}