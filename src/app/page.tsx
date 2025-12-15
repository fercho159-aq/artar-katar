'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Dna, Gem, MicVocal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";


export default function Home() {
  const { translations } = useLanguage();
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/passage-7685853_1280.webp"
          alt="Portal multidimensional de Astar Katar"
          data-ai-hint="mystical archway"
          fill
          className="object-cover -z-10 brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/40 -z-10" />
        <div className="container px-4 md:px-6 animate-fade-in-up [animation-fill-mode:forwards] [animation-delay:0.3s]">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline [text-shadow:0_3px_6px_rgba(0,0,0,0.7)]">
            {translations.home.hero.title}
          </h1>
          <p className="mx-auto max-w-[800px] text-gray-200 md:text-xl my-6 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
            {translations.home.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center max-w-4xl">
          <p className="text-lg md:text-xl text-foreground/80">
            {translations.home.intro.text}
          </p>
        </div>
      </section>

      {/* Astar Katar & Frank Alexander Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          {/* Layout con imagen central */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* Columna izquierda - ¿Quién es Astar Katar? */}
            <div className="space-y-6 order-2 lg:order-1">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">{translations.home.astar.title}</h2>
              <p className="text-muted-foreground">
                {translations.home.astar.p1}
              </p>
              <p className="text-muted-foreground">
                {translations.home.astar.p2}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{translations.home.astar.l1}</li>
                <li>{translations.home.astar.l2}</li>
                <li>{translations.home.astar.l3}</li>
                <li>{translations.home.astar.l4}</li>
              </ul>
            </div>

            {/* Columna central - Imagen de Frank Alexander */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-sm">
                <Image
                  src="/images/frank-alexander.jpg"
                  alt="Frank Alexander"
                  width={400}
                  height={500}
                  className="rounded-2xl shadow-2xl object-cover w-full"
                  priority
                />
                <p className="text-center mt-4 text-sm text-muted-foreground font-medium">Frank Alexander</p>
              </div>
            </div>

            {/* Columna derecha - Frank Alexander: el Walk-In */}
            <div className="space-y-6 order-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">{translations.home.frank.title}</h2>
              <p className="text-muted-foreground">
                {translations.home.frank.p1}
              </p>
              <p className="text-muted-foreground">
                {translations.home.frank.p2}
              </p>
              <p className="text-muted-foreground">
                {translations.home.frank.p3}
              </p>
              <p className="text-muted-foreground">
                {translations.home.frank.p4}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Allies of Light Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">{translations.home.allies.title}</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            {translations.home.allies.p1}
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm text-foreground">
            <Card className="p-4 bg-card">
              <p className="font-semibold">{translations.home.allies.c1.title}</p>
              <p className="text-xs text-muted-foreground">{translations.home.allies.c1.subtitle}</p>
            </Card>
            <Card className="p-4 bg-card">
              <p className="font-semibold">{translations.home.allies.c2.title}</p>
              <p className="text-xs text-muted-foreground">{translations.home.allies.c2.subtitle}</p>
            </Card>
            <Card className="p-4 bg-card col-span-2 sm:col-span-1">
              <p className="font-semibold">{translations.home.allies.c3.title}</p>
              <p className="text-xs text-muted-foreground">{translations.home.allies.c3.subtitle}</p>
            </Card>
          </div>
          <p className="mt-8 text-muted-foreground text-sm">
            {translations.home.allies.p2}
          </p>
        </div>
      </section>

      {/* Product Sections */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container space-y-16">
          {/* Workshops - Temporalmente desactivado */}
          {/*
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold font-headline text-primary mb-4">{translations.home.workshops.title}</h3>
              <p className="text-muted-foreground mb-4">
                {translations.home.workshops.p1}
              </p>
              <p className="text-muted-foreground mb-4 font-semibold">
                {translations.home.workshops.p2}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>{translations.home.workshops.l1}</li>
                <li>{translations.home.workshops.l2}</li>
                <li>{translations.home.workshops.l3}</li>
                <li>{translations.home.workshops.l4}</li>
              </ul>
              <p className="text-muted-foreground mb-6">
                {translations.home.workshops.p3}
              </p>
              <Button asChild>
                <Link href="/talleres">
                  <Dna className="mr-2" /> {translations.home.quickAccess.workshops}
                </Link>
              </Button>
            </div>
            <Image src="https://images.unsplash.com/photo-1532190795157-3f983fb7fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzcGlyaXR1YWwlMjBsZWFybmluZ3xlbnwwfHx8fDE3NjQ2OTIxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Spiritual learning" data-ai-hint="spiritual learning" width={600} height={400} className="rounded-lg object-cover aspect-video" />
          </div>
          */}
          {/* Bracelets */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Image src="https://www.astar-katar.com/images/pulseras/2.png" alt="Pulsera de cuarzo" data-ai-hint="crystal bracelet" width={600} height={400} className="rounded-lg object-cover aspect-video md:order-2" />
            <div className="md:order-1">
              <h3 className="text-3xl font-bold font-headline text-primary mb-4">{translations.home.bracelets.title}</h3>
              <p className="text-muted-foreground mb-4">
                {translations.home.bracelets.p1}
              </p>
              <p className="text-muted-foreground mb-4 font-semibold">
                {translations.home.bracelets.p2}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>{translations.home.bracelets.l1}</li>
                <li>{translations.home.bracelets.l2}</li>
                <li>{translations.home.bracelets.l3}</li>
                <li>{translations.home.bracelets.l4}</li>
                <li>{translations.home.bracelets.l5}</li>
              </ul>
              <p className="text-muted-foreground mb-6">
                {translations.home.bracelets.p3}
              </p>
              <Button asChild>
                <Link href="/tienda">
                  <Gem className="mr-2" /> {translations.home.quickAccess.bracelets}
                </Link>
              </Button>
            </div>
          </div>
          {/* Meditations - Temporalmente desactivado */}
          {/*
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold font-headline text-primary mb-4">{translations.home.meditations.title}</h3>
              <p className="text-muted-foreground mb-4">
                {translations.home.meditations.p1}
              </p>
              <p className="text-muted-foreground mb-4 font-semibold">
                {translations.home.meditations.p2}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>{translations.home.meditations.l1}</li>
                <li>{translations.home.meditations.l2}</li>
                <li>{translations.home.meditations.l3}</li>
              </ul>
              <p className="text-muted-foreground mb-6">
                {translations.home.meditations.p3}
              </p>
              <Button asChild>
                <Link href="/meditaciones">
                  <MicVocal className="mr-2" /> {translations.home.quickAccess.meditations}
                </Link>
              </Button>
            </div>
            <Image src="https://images.unsplash.com/photo-1609718561976-d52836e625cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzZXJlbmUlMjBtZWRpdGF0aW9ufGVufDB8fHx8MTc2NDYzNzYxMnww&ixlib=rb-4.1.0&q=80&w=1080" alt="Meditación serena" data-ai-hint="serene meditation" width={600} height={400} className="rounded-lg object-cover aspect-video" />
          </div>
          */}
        </div>
      </section>

      {/* Subscription Form */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-3xl mx-auto">
          <Card className="p-6 md:p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold font-headline text-primary">{translations.home.subscribe.title}</h3>
              <p className="text-muted-foreground mt-2 mb-6">{translations.home.subscribe.subtitle}</p>
            </div>
            <form className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-full space-y-2">
                <Label htmlFor="name-sub">{translations.home.subscribe.nameLabel}</Label>
                <Input id="name-sub" placeholder={translations.home.subscribe.namePlaceholder} />
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="whatsapp-sub">WhatsApp</Label>
                <Input id="whatsapp-sub" placeholder={translations.home.subscribe.whatsappPlaceholder} />
              </div>
              <div className="w-full sm:w-auto self-end">
                <Button type="submit" className="w-full sm:w-auto">{translations.home.subscribe.buttonText}</Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
}
