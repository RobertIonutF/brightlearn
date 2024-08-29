// src/app/page.tsx
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, MessageSquare, Brain, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import heroImage from "@public/images/hero.png";

const features = [
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Chat cu AI",
    description: "Conversează cu un asistent AI inteligent pentru a aprofunda înțelegerea oricărui subiect."
  },
  {
    icon: <FileQuestion className="h-10 w-10 text-primary" />,
    title: "Generare Quiz-uri",
    description: "Creează quiz-uri personalizate pentru a-ți testa cunoștințele în orice domeniu."
  },
  {
    icon: <Brain className="h-10 w-10 text-primary" />,
    title: "Învățare Adaptivă",
    description: "Experiență de învățare personalizată care se adaptează la nevoile și progresul tău."
  }
]

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Învață Orice cu BrightLearn
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Descoperă o nouă dimensiune a învățării cu asistentul nostru AI și quiz-uri interactive. 
                Explorează, înțelege și stăpânește orice subiect care te pasionează.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg" className="animate-bounce">
                <Link href="/sign-in">Începe Gratuit <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/despre">Află mai multe</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Caracteristici Principale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                De ce să alegi BrightLearn?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 md:text-lg">
                BrightLearn este platforma ideală pentru oricine dorește să-și îmbunătățească 
                cunoștințele în orice domeniu. Cu tehnologia noastră avansată de AI, transformăm 
                procesul de învățare într-o experiență interactivă și personalizată, adaptată 
                nevoilor tale unice.
              </p>
              <Button asChild size="lg">
                <Link href="/sign-in">Încearcă Acum</Link>
              </Button>
            </div>
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image 
                src={heroImage}
                alt="Studenți învățând cu BrightLearn" 
                layout="fill"
                objectFit="cover"
                className="transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Pregătit să revoluționezi modul în care înveți?
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mb-8">
            Alătură-te miilor de cursanți care deja folosesc BrightLearn pentru a-și 
            îmbunătăți cunoștințele și a excela în domeniile lor de interes.
          </p>
          <Button asChild size="lg" className="animate-pulse">
            <Link href="/sign-in">Creează Cont Gratuit</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}