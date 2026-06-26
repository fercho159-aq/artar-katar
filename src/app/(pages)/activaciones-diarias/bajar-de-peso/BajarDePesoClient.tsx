'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AudioPlayer } from '@/components/activaciones/AudioPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, CalendarClock, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

const PROGRAM_SLUG = 'bajar-de-peso';

type Step = {
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  duration_seconds: number | null;
  sequence_order: number;
  locked: boolean;
  unlock_at: string | null;
  prev_started: boolean;
  url: string | null;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export default function BajarDePesoClient() {
  const { user, activacionesSubscription, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?redirect=/activaciones-diarias/bajar-de-peso');
      return;
    }
    if (!activacionesSubscription || activacionesSubscription.status !== 'Activa') {
      router.push('/activaciones-diarias');
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`/api/activaciones/programa/${PROGRAM_SLUG}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid }),
        });
        if (!res.ok) throw new Error('No se pudo cargar el programa.');
        const data: { steps: Step[] } = await res.json();
        setSteps(data.steps);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, activacionesSubscription, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="container py-24 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button asChild>
          <Link href="/activaciones-diarias/biblioteca">Volver a la biblioteca</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container py-16 md:py-20">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/activaciones-diarias/biblioteca">
            <ArrowLeft className="h-4 w-4 mr-1" /> Biblioteca
          </Link>
        </Button>

        <div className="flex flex-col items-center text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest">
            <Sparkles className="h-4 w-4" /> Programa de 5 activaciones
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
            Bajar de Peso y Rejuvenecimiento Cuántico
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Con Astar Katar y los seres estelares de Sirio. Un programa secuencial: cada
            activación debe repetirse <strong>durante 21 días</strong>, varias veces al día, antes
            de desbloquear la siguiente. Síguelo en orden para que los nuevos programas
            multidimensionales penetren en profundidad.
          </p>
        </div>

        {/* Cómo funciona */}
        <Card className="max-w-2xl mx-auto mb-10 bg-primary/5 border-primary/30">
          <CardContent className="p-4 text-sm text-muted-foreground">
            La conexión con Astar Katar se establece automáticamente al escuchar la voz de Frank
            Alexander. No es tan importante entender los conceptos mentales, sino recibir las ondas
            de información en los planos sutiles que llegan a tu supra consciente. La siguiente
            activación se desbloquea 21 días después de que reproduces por primera vez la anterior.
          </CardContent>
        </Card>

        <div className="max-w-3xl mx-auto space-y-5">
          {steps.map((step) => (
            <div key={step.slug} className="flex gap-4">
              {/* Número de paso */}
              <div className="shrink-0">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm ${
                    step.locked
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {step.sequence_order}
                </div>
              </div>

              <div className="flex-grow">
                {step.locked || !step.url ? (
                  <Card className="border-dashed">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-lg leading-tight text-muted-foreground">
                            {step.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Lock className="h-4 w-4" />
                            {step.prev_started && step.unlock_at ? (
                              <span>
                                Se desbloquea el <strong>{formatDate(step.unlock_at)}</strong>{' '}
                                ({daysUntil(step.unlock_at)} días)
                              </span>
                            ) : (
                              <span>
                                Escucha y repite la activación anterior durante 21 días para
                                desbloquearla.
                              </span>
                            )}
                          </div>
                        </div>
                        <CalendarClock className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <AudioPlayer
                    slug={step.slug}
                    userId={user?.uid}
                    title={step.title}
                    description={step.description}
                    category={step.category}
                    durationSeconds={step.duration_seconds}
                    audioUrl={step.url}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
