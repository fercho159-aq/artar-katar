'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AudioPlayer } from '@/components/activaciones/AudioPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import type { Activacion } from '@/lib/types';

type ActivacionItem = Pick<Activacion, 'id' | 'slug' | 'title' | 'description' | 'category' | 'duration_seconds' | 'sort_order'>;

export default function BibliotecaPage() {
  const { user, activacionesSubscription, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activaciones, setActivaciones] = useState<ActivacionItem[]>([]);
  const [urlMap, setUrlMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?redirect=/activaciones-diarias/biblioteca');
      return;
    }
    if (!activacionesSubscription || activacionesSubscription.status !== 'Activa') {
      router.push('/activaciones-diarias');
      return;
    }

    const load = async () => {
      try {
        const [listRes, signRes] = await Promise.all([
          fetch('/api/activaciones'),
          fetch('/api/activaciones/sign-urls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid }),
          }),
        ]);
        if (!listRes.ok) throw new Error('No se pudo cargar la lista.');
        if (!signRes.ok) throw new Error('No se pudo firmar las URLs.');

        const list: ActivacionItem[] = await listRes.json();
        const signData: { urls: { slug: string; url: string }[] } = await signRes.json();

        const map: Record<string, string> = {};
        for (const s of signData.urls) map[s.slug] = s.url;

        setActivaciones(list);
        setUrlMap(map);
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
          <Link href="/activaciones-diarias">Volver</Link>
        </Button>
      </div>
    );
  }

  const daysRemaining = activacionesSubscription?.days_remaining;

  return (
    <div className="bg-background">
      <div className="container py-16 md:py-20">
        <div className="flex flex-col items-center text-center mb-10 space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
            Biblioteca de Activaciones Diarias
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Escoge la activación que intuitivamente te atraiga y repítela varias veces durante
            el día. Déjate guiar por tu intuición.
          </p>
        </div>

        {/* Subscription status */}
        <Card className="max-w-2xl mx-auto mb-10 bg-primary/5 border-primary/30">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-semibold">Suscripción activa</p>
                {daysRemaining !== undefined && daysRemaining !== null && (
                  <p className="text-muted-foreground">
                    {daysRemaining} día{daysRemaining === 1 ? '' : 's'} restante{daysRemaining === 1 ? '' : 's'}
                  </p>
                )}
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/activaciones-diarias">Renovar / Ver planes</Link>
            </Button>
          </CardContent>
        </Card>

        {activaciones.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Pronto agregaremos las primeras activaciones.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 max-w-6xl mx-auto">
            {activaciones.map((a) => (
              <AudioPlayer
                key={a.id}
                slug={a.slug}
                userId={user?.uid}
                title={a.title}
                description={a.description}
                category={a.category}
                durationSeconds={a.duration_seconds}
                audioUrl={urlMap[a.slug] || ''}
              />
            ))}
          </div>
        )}

        <div className="mt-12 max-w-3xl mx-auto p-6 bg-muted/40 rounded-xl">
          <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Cómo usarlas
          </h3>
          <p className="text-sm text-muted-foreground">
            Úsalas por lo menos durante un mes. Si puedes hacerlo un hábito constante, su
            efecto acumulativo se multiplicará: aumentarán tu nivel de vibración y cambiarán
            tu vida.
          </p>
        </div>
      </div>
    </div>
  );
}
