import { dbQuery } from '@/lib/db';
import { PlanCard } from '@/components/activaciones/PlanCard';
import type { SubscriptionPlan } from '@/lib/types';
import { Sparkles, Sun, Compass, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getPlans(): Promise<SubscriptionPlan[]> {
  const rows = await dbQuery(
    `SELECT id, plan_sku, program, name, price, duration_days, is_active
     FROM subscription_plans
     WHERE program = 'activaciones_diarias' AND is_active = TRUE
     ORDER BY duration_days ASC`
  );
  return rows as SubscriptionPlan[];
}

export default async function ActivacionesDiariasPage() {
  const plans = await getPlans();
  const youtubeId = process.env.NEXT_PUBLIC_ACTIVACIONES_INTRO_YT || '';

  return (
    <div className="bg-background">
      <div className="container py-16 md:py-24">
        {/* Hero */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest">
            <Sparkles className="h-4 w-4" /> Nuevo Programa
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
            Programa de Activaciones Diarias
          </h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Audios cortos con activaciones directas que puedes hacer durante el día, mientras
            manejas o sigues tus actividades rutinarias con los ojos abiertos.
          </p>
        </div>

        {/* Intro video */}
        {youtubeId && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Introducción - Activaciones Diarias"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Sun className="h-6 w-6" />
              </div>
              <h3 className="font-headline text-lg font-semibold mb-2">Durante el día</h3>
              <p className="text-sm text-muted-foreground">
                Escucha las activaciones con los ojos abiertos mientras sigues tu rutina.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-headline text-lg font-semibold mb-2">Conexión directa</h3>
              <p className="text-sm text-muted-foreground">
                Cada activación te conecta con el portal interdimensional de Astar Katar y los
                seres cósmicos que llamaste.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-headline text-lg font-semibold mb-2">Efecto acumulativo</h3>
              <p className="text-sm text-muted-foreground">
                Úsalas al menos un mes — el hábito constante multiplica el efecto, elevando tu
                vibración día a día.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-headline mb-3">Elige tu plan</h2>
            <p className="text-muted-foreground">
              Con tu afiliación accedes a todas las activaciones sin límite. Periódicamente
              agregamos nuevas.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.plan_sku}
                plan={plan}
                highlight={plan.plan_sku === 'ACT-3M'}
              />
            ))}
          </div>
        </div>

        {/* Complement */}
        <div className="max-w-4xl mx-auto mt-20 p-8 bg-muted/40 rounded-xl">
          <h3 className="text-2xl font-bold font-headline mb-3 text-center">
            Cómo complementar las activaciones
          </h3>
          <p className="text-muted-foreground text-center">
            Las activaciones diarias se combinan perfectamente con nuestras{' '}
            <a href="/tienda" className="text-primary underline">
              pulseras activadas
            </a>{' '}
            por los seres cósmicos y con nuestros{' '}
            <a href="/talleres" className="text-primary underline">
              talleres de activaciones intensivas nocturnas
            </a>
            . Estos tres elementos se complementan y se potencializan entre ellos.
          </p>
        </div>
      </div>
    </div>
  );
}
