'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { SubscriptionPlan } from '@/lib/types';

type Props = {
  plan: SubscriptionPlan;
  highlight?: boolean;
};

export function PlanCard({ plan, highlight }: Props) {
  const router = useRouter();
  const { user, activacionesSubscription } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const hasActiveSub = activacionesSubscription && activacionesSubscription.status === 'Activa';

  const handleClick = async () => {
    if (!user) {
      router.push('/login?redirect=/activaciones-diarias');
      return;
    }

    if (hasActiveSub) {
      router.push('/activaciones-diarias/biblioteca');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/activaciones/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, plan_sku: plan.plan_sku }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear sesión de pago.');

      localStorage.setItem(
        'pendingSubscription',
        JSON.stringify({
          reference: data.reference,
          plan_sku: plan.plan_sku,
          program: plan.program,
          user_uid: user.uid,
        })
      );

      window.location.href = data.payment_url;
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (err as Error).message,
      });
      setLoading(false);
    }
  };

  const label = hasActiveSub ? 'Ir a la biblioteca' : 'Suscribirme';

  return (
    <Card
      className={`flex flex-col relative overflow-hidden ${
        highlight ? 'border-primary border-2 shadow-lg' : ''
      }`}
    >
      {highlight && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
          Más popular
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="font-headline">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-4xl font-bold text-primary mb-2">
          ${Number(plan.price).toLocaleString('es-MX')}
          <span className="text-base font-normal text-muted-foreground"> MXN</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {plan.duration_days === 1
            ? 'Acceso por 1 día'
            : `Acceso por ${plan.duration_days} días`}
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>Acceso ilimitado a todas las activaciones</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>Nuevas activaciones periódicamente</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>Reproducción sin límites durante el día</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleClick}
          disabled={loading}
          variant={highlight ? 'default' : 'outline'}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Star className="mr-2 h-4 w-4" /> {label}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
