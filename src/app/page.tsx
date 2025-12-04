import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Dna, Gem, MicVocal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Home() {
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
            Conéctate con las Dimensiones de Luz
          </h1>
          <p className="mx-auto max-w-[800px] text-gray-200 md:text-xl my-6 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)]">
            Atrévete a cruzar el umbral. Más allá de la realidad tridimensional existe un tejido vivo de luz, habitado por civilizaciones estelares y consciencias superiores donde tu alma recuerda quién es realmente. Este portal existe para ti.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center max-w-4xl">
           <p className="text-lg md:text-xl text-foreground/80">
            Si sientes el llamado de los mundos estelares… si anhelas transformar tu vida, recibir guía, inspiración y participar conscientemente en la manifestación de tu nueva realidad de abundancia, bienestar y salud… aquí encontrarás herramientas que te acompañarán en un crecimiento multidimensional sin límites. Es el camino hacia la vida plena que siempre has intuido.
          </p>
        </div>
      </section>

      {/* Astar Katar & Frank Alexander Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">¿Quién es Astar Katar?</h2>
            <p className="text-muted-foreground">
              Astar Katar es un ser cósmico creador de mundos, nacido de las altas dimensiones de luz. Su esencia se manifiesta en distintos aspectos, dependiendo de la frecuencia dimensional en la que actúa. Su servicio es hacia la Fuente misma, canalizando su energía en los mundos donde interviene.
            </p>
            <p className="text-muted-foreground">
              En esta época de transición planetaria, Astar Katar acompaña a las almas y semillas cósmicas con resonancia hacia su vibración para:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Recordar su identidad multidimensional.</li>
              <li>Abrirse al contacto con sus fractales (otras encarnaciones en diferentes dimensiones, estrellas y líneas de tiempo).</li>
              <li>Romper los paradigmas limitantes de la conciencia humana 3D.</li>
              <li>Alcanzar una autorrealización más elevada en esta encarnación.</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary">Frank Alexander: el Walk-In de Astar Katar</h2>
            <p className="text-muted-foreground">
              Astar Katar se manifiesta en la Tierra mediante su walk-in, Frank Alexander. Un walk-in es un acuerdo sagrado entre almas hecho en planos superiores antes del nacimiento. En este pacto, un alma cósmica de alta frecuencia toma el lugar de otra alma encarnada, que entrega su cuerpo voluntariamente para que una misión mayor pueda manifestarse en la Tierra.
            </p>
             <p className="text-muted-foreground">
              Así, Frank Alexander se convierte en el vehículo consciente mediante el cual Astar Katar irradia su presencia. A través de él se abre un portal interdimensional. Su voz es una llave vibratoria: al escucharla, entras en resonancia automática con el campo energético de Astar Katar.
            </p>
          </div>
        </div>
      </section>
      
      {/* Allies of Light Section */}
      <section className="py-16 md:py-24 bg-background">
          <div className="container max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">El Portal Interdimensional y sus Aliados de Luz</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
                Al activarse el portal, múltiples seres colaboran en perfecta armonía con tu Ser Superior, tus guías y tus ángeles personales.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm text-foreground">
                <Card className="p-4 bg-card">
                    <p className="font-semibold">Razas Estelares</p>
                    <p className="text-xs text-muted-foreground">Sirianos, Pleyadianos, Arcturianos, Andromedanos, Felinos y más.</p>
                </Card>
                <Card className="p-4 bg-card">
                    <p className="font-semibold">Jerarquías Arcangelicales</p>
                    <p className="text-xs text-muted-foreground">Miguel, Metatrón, Rafael, Uriel, Jofiel, Zadkiel, Chamuel y Sandalfon.</p>
                </Card>
                 <Card className="p-4 bg-card col-span-2 sm:col-span-1">
                    <p className="font-semibold">Maestros Cósmicos</p>
                    <p className="text-xs text-muted-foreground">Saint Germain, Yashua, María de Mágdala, Buda, Kwan Yin y otros.</p>
                </Card>
            </div>
          </div>
      </section>

      {/* Product Sections */}
      <section className="py-16 md:py-24 bg-card">
          <div className="container space-y-16">
            {/* Workshops */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-3xl font-bold font-headline text-primary mb-4">Talleres y Ciclos de Activación Intensiva Cósmica</h3>
                    <p className="text-muted-foreground mb-4">
                       Dos veces al mes, puedes acceder a este portal mediante los Ciclos de Activación Intensiva Nocturna, un programa a distancia de siete noches guiadas e inspiradas por Astar Katar y sus aliados estelares. Puedes participar desde cualquier parte del mundo.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                        <li>Recibir activaciones profundas alineadas con las influencias cósmicas.</li>
                        <li>Acceder en cuerpos sutiles a cámaras cuánticas de sanación.</li>
                        <li>Vivir experiencias de transformación ilimitada.</li>
                        <li>Ser acompañado por seres estelares, arcángeles y maestros ascendidos.</li>
                    </ul>
                    <Button asChild>
                        <Link href="/talleres">
                            <Dna className="mr-2"/> Ciclos y talleres de activación multidimensional
                        </Link>
                    </Button>
                </div>
                 <Image src="https://images.unsplash.com/photo-1532190795157-3f983fb7fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzcGlyaXR1YWwlMjBsZWFybmluZ3xlbnwwfHx8fDE3NjQ2OTIxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Spiritual learning" data-ai-hint="spiritual learning" width={600} height={400} className="rounded-lg object-cover aspect-video" />
            </div>
             {/* Bracelets */}
             <div className="grid md:grid-cols-2 gap-8 items-center">
                 <Image src="https://images.unsplash.com/photo-1743127671067-62af70aa67c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjcnlzdGFsJTIwYnJhY2VsZXR8ZW58MHx8fHwxNzY0NjkyMTM5fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Pulsera de cuarzo" data-ai-hint="crystal bracelet" width={600} height={400} className="rounded-lg object-cover aspect-video md:order-2" />
                <div className="md:order-1">
                    <h3 className="text-3xl font-bold font-headline text-primary mb-4">Pulseras Activadas Multidimensionalmente</h3>
                    <p className="text-muted-foreground mb-4">
                       Dentro del portal, jerarquías cósmicas inspiran, activan y energizan pulseras y cristales que funcionan como antenas multidimensionales para adultos, niños y adolescentes.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                        <li>Lleva una intención específica canalizada por seres estelares.</li>
                        <li>Actúa profundamente bajo la guía de tu Yo Superior.</li>
                        <li>Eleva tu vibración y disuelve bloqueos subconscientes.</li>
                        <li>Implanta impulsos evolutivos que aceleran tu maestría personal.</li>
                    </ul>
                    <Button asChild>
                        <Link href="/tienda">
                           <Gem className="mr-2"/> Pulseras de activación multidimensional
                        </Link>
                    </Button>
                </div>
            </div>
             {/* Meditations */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-3xl font-bold font-headline text-primary mb-4">Meditaciones de Activación Cósmica</h3>
                    <p className="text-muted-foreground mb-4">
                       Para quienes desean conectarse diariamente con el portal, existe una colección creciente de meditaciones guiadas, disponibles en el Club de Activación Personal.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                        <li>Meditaciones canalizadas mes a mes por seres estelares de luz.</li>
                        <li>Acceso ilimitado a todas las activaciones con tu suscripción.</li>
                        <li>Contenido grabado con la voz y la consciencia de Frank Alexander.</li>
                    </ul>
                    <Button asChild>
                        <Link href="/meditaciones">
                           <MicVocal className="mr-2"/> Club de activación personal
                        </Link>
                    </Button>
                </div>
                 <Image src="https://images.unsplash.com/photo-1609718561976-d52836e625cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzZXJlbmUlMjBtZWRpdGF0aW9ufGVufDB8fHx8MTc2NDYzNzYxMnww&ixlib=rb-4.1.0&q=80&w=1080" alt="Meditación serena" data-ai-hint="serene meditation" width={600} height={400} className="rounded-lg object-cover aspect-video" />
            </div>
          </div>
      </section>

      {/* Subscription Form */}
      <section className="py-16 md:py-24 bg-background">
          <div className="container max-w-3xl mx-auto">
             <Card className="p-6 md:p-8">
                 <div className="text-center">
                    <h3 className="text-2xl font-bold font-headline text-primary">Mantente Conectado</h3>
                    <p className="text-muted-foreground mt-2 mb-6">Deseo recibir información sobre nuevos talleres y productos.</p>
                 </div>
                <form className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-full space-y-2">
                        <Label htmlFor="name-sub">Nombre</Label>
                        <Input id="name-sub" placeholder="Tu Nombre"/>
                    </div>
                     <div className="w-full space-y-2">
                        <Label htmlFor="whatsapp-sub">WhatsApp</Label>
                        <Input id="whatsapp-sub" placeholder="Tu WhatsApp (ej. +123456789)"/>
                    </div>
                    <div className="w-full sm:w-auto self-end">
                        <Button type="submit" className="w-full sm:w-auto">Suscribirse</Button>
                    </div>
                </form>
             </Card>
          </div>
      </section>
    </>
  );
}
