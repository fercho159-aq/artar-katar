'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Si el usuario tiene una suscripción activa a las activaciones diarias,
 * lo manda a la biblioteca en vez de mostrar la landing de compra.
 */
export function SubscriberRedirect() {
  const { activacionesSubscription, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (activacionesSubscription?.status === 'Activa') {
      router.replace('/activaciones-diarias/biblioteca');
    }
  }, [activacionesSubscription, isLoading, router]);

  return null;
}
