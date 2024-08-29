// src/app/despre/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { BookOpen, Brain, FileQuestion, Zap } from 'lucide-react';

export const metadata = {
  title: 'Despre BrightLearn | Platforma de Învățare Interactivă',
  description: 'Descoperiți BrightLearn - platforma inovatoare de e-learning pentru toate domeniile de studiu. Învățare personalizată, quiz-uri interactive și asistență AI.',
};

const features = [
  {
    icon: <BookOpen className="w-10 h-10 text-primary" />,
    title: "Lecții Personalizate",
    description: "Creați și accesați lecții interactive pe orice subiect, adaptate stilului personal de învățare."
  },
  {
    icon: <Brain className="w-10 h-10 text-primary" />,
    title: "Asistent AI Inteligent",
    description: "Conversați cu un asistent AI avansat pentru a aprofunda înțelegerea și a clarifica concepte complexe."
  },
  {
    icon: <FileQuestion className="w-10 h-10 text-primary" />,
    title: "Quiz-uri Adaptive",
    description: "Testați-vă cunoștințele cu quiz-uri generate automat, care se adaptează la nivelul și progresul dumneavoastră."
  },
  {
    icon: <Zap className="w-10 h-10 text-primary" />,
    title: "Învățare Accelerată",
    description: "Beneficiați de tehnici de învățare accelerată și memorare pe termen lung, optimizate prin AI."
  }
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Despre BrightLearn</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          BrightLearn este platforma inovatoare de învățare interactivă dedicată tuturor celor pasionați de cunoaștere, 
          oferind o experiență educațională personalizată și eficientă, indiferent de domeniul de studiu.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Misiunea Noastră</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Misiunea BrightLearn este să democratizeze accesul la educație de calitate prin tehnologie avansată și metode de învățare inovatoare. 
              Ne propunem să oferim fiecărui utilizator instrumentele necesare pentru a-și atinge potențialul maxim de învățare, 
              indiferent de subiectul studiat sau de nivelul de expertiză.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Viziunea Noastră</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Aspirăm să devenim liderul global în educația online personalizată, creând o comunitate de învățare dinamică și diversă. 
              Vizăm să revoluționăm modul în care oamenii învață și să inspirăm o pasiune pentru cunoaștere continuă, 
              contribuind astfel la dezvoltarea personală și profesională a utilizatorilor noștri.
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
        <h2 className="text-3xl font-bold mb-6">Începeți Călătoria Spre Cunoaștere</h2>
        <p className="mb-6 text-lg">
          Indiferent dacă sunteți student, profesionist sau pur și simplu pasionat de învățare, 
          BrightLearn vă oferă instrumentele și resursele necesare pentru a excela în domeniul ales și pentru a vă atinge obiectivele educaționale.
        </p>
        <Button asChild size="lg">
          <Link href="/sign-up">Înregistrați-vă Gratuit</Link>
        </Button>
      </section>
    </div>
  );
}