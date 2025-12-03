import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Gem, Group, Headphones } from "lucide-react";

export default function Home() {
  const heroImageUrl = "https://cdn.pixabay.com/photo/2022/12/29/21/29/passage-7685853_1280.jpg";
  const workshopImage1Url = "https://images.unsplash.com/photo-1532190795157-3f983fb7fa3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzcGlyaXR1YWwlMjBsZWFybmluZ3xlbnwwfHx8fDE3NjQ2OTIxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const workshopImage2Url = "https://images.unsplash.com/photo-1560287810-1c89fede7218?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxzcGlyaXR1YWwlMjBhY3RpdmF0aW9ufGVufDB8fHx8MTc2NDY5MjE0MHww&ixlib=rb-4.1.0&q=80&w=1080";
  const braceletImageUrl = "https://images.unsplash.com/photo-1743127671067-62af70aa67c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjcnlzdGFsJTIwYnJhY2VsZXR8ZW58MHx8fHwxNzY0NjkyMTM5fDA&ixlib=rb-4.1.0&q=80&w=1080";
  const crystalImageUrl = "https://images.unsplash.com/photo-1727430473786-e88adb86e463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxxdWFydHolMjBjcnlzdGFsfGVufDB8fHx8MTc2NDY5MjE0MHww&ixlib=rb-4.1.0&q=80&w=1080";
  const meditationImage1Url = "https://images.unsplash.com/photo-1609718561976-d52836e625cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzZXJlbmUlMjBtZWRpdGF0aW9ufGVufDB8fHx8MTc2NDYzNzYxMnww&ixlib=rb-4.1.0&q=80&w=1080";
  const meditationImage2Url = "https://images.unsplash.com/photo-1532979772520-f2763956cce0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYWxtJTIwbGFrZXxlbnwwfHx8fDE3NjQ2NTUwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080";
  const shopImages = [braceletImageUrl, crystalImageUrl, braceletImageUrl, crystalImageUrl];

  return (
      <>
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              alt="A mystical archway opening to a starry sky"
              data-ai-hint="mystical archway"
              fill
              className="object-cover -z-10 brightness-75"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/30 -z-10" />
          <div className="container px-4 md:px-6 opacity-0 animate-fade-in-up [animation-fill-mode:forwards] [animation-delay:0.3s]">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline [text-shadow:0_3px_6px_rgba(0,0,0,0.5)]">
              Portal Multidimensional de Astar Katar
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl my-6 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
              Explora y conecta con las enseñanzas y activaciones de Astar Katar a través de Frank Alexander.
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
              <Link href="#explorar">
                Explorar Ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Overview */}
        <section id="explorar" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-card transition-colors">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Group className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Talleres y Ciclos</h3>
                <p className="text-muted-foreground mt-2">Participa en los Ciclos de Activación Intensiva Nocturna y expande tu conciencia.</p>
                <Button variant="link" asChild className="mt-4 text-primary">
                  <Link href="/talleres">Ver Talleres <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-card transition-colors">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Gem className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Tienda Cósmica</h3>
                <p className="text-muted-foreground mt-2">Adquiere pulseras y cristales activados multidimensionalmente para tu viaje espiritual.</p>
                <Button variant="link" asChild className="mt-4 text-primary">
                  <Link href="/tienda">Ir a la Tienda <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-card transition-colors">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Headphones className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-headline">Meditaciones Guiadas</h3>
                <p className="text-muted-foreground mt-2">Accede a una biblioteca de meditaciones para tu paz interior y conexión.</p>
                <Button variant="link" asChild className="mt-4 text-primary">
                  <Link href="/meditaciones">Explorar Meditaciones <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Talleres Section */}
        <section id="talleres" className="py-16 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Próximos Talleres y Ciclos</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Sumérgete en experiencias transformadoras diseñadas para elevar tu vibración.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 mt-12">
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  {workshopImage1Url && <Image src={workshopImage1Url} alt="Spiritual learning" data-ai-hint="spiritual learning" width={600} height={400} className="rounded-t-lg object-cover aspect-video" />}
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle>Ciclo de Activación Nocturna</CardTitle>
                  <CardDescription className="mt-2">Un viaje de 21 días para despertar tus dones y talentos multidimensionales.</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href="/talleres/wshop_001">Registrarse Ahora</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  {workshopImage2Url && <Image src={workshopImage2Url} alt="Spiritual activation" data-ai-hint="spiritual activation" width={600} height={400} className="rounded-t-lg object-cover aspect-video" />}
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle>Conexión con tu Yo Superior</CardTitle>
                  <CardDescription className="mt-2">Un taller intensivo de fin de semana para alinear tu energía con tu propósito de vida.</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href="/talleres/wshop_002">Más Información</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Tienda Section */}
        <section id="tienda" className="py-16 md:py-24">
           <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Desde la Tienda Cósmica</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Herramientas energéticas para potenciar tu camino espiritual.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-12">
              {shopImages.map((item, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <Image src={item} alt={index % 2 === 0 ? 'Crystal bracelet' : 'Quartz crystal'} data-ai-hint={index % 2 === 0 ? 'crystal bracelet' : 'quartz crystal'} width={500} height={500} className="rounded-t-lg object-cover aspect-square" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg">{index % 2 === 0 ? 'Pulsera de Cuarzo Rosa' : 'Cristal Atlante'}</CardTitle>
                    <p className="text-lg font-semibold mt-2 text-primary">$ {index % 2 === 0 ? '44.00' : '77.00'}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/tienda">Ver Producto</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Meditaciones Section */}
        <section id="meditaciones" className="py-16 md:py-24 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Biblioteca de Meditaciones</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Encuentra tu centro y eleva tu espíritu con nuestras meditaciones guiadas.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row">
                  {meditationImage1Url && <Image src={meditationImage1Url} alt="Serene meditation" data-ai-hint="serene meditation" width={250} height={167} className="rounded-t-lg md:rounded-l-lg md:rounded-t-none object-cover aspect-[3/2] md:w-1/3" />}
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <CardTitle>Meditación de Anclaje a Tierra</CardTitle>
                      <CardDescription className="mt-2">15 min - Conecta con la energía de Gaia.</CardDescription>
                    </div>
                    <Button asChild className="mt-4 w-full sm:w-auto">
                      <Link href="/meditaciones/med_001">Escuchar Ahora</Link>
                    </Button>
                  </div>
                </div>
              </Card>
               <Card className="hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row">
                  {meditationImage2Url && <Image src={meditationImage2Url} alt="Calm lake" data-ai-hint="calm lake" width={250} height={167} className="rounded-t-lg md:rounded-l-lg md:rounded-t-none object-cover aspect-[3/2] md:w-1/3" />}
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <CardTitle>Activación del Corazón Cristalino</CardTitle>
                      <CardDescription className="mt-2">25 min - Abre tu corazón a la frecuencia del amor.</CardDescription>
                    </div>
                    <Button asChild className="mt-4 w-full sm:w-auto">
                      <Link href="/meditaciones/med_002">Escuchar Ahora</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </>
  );
}
