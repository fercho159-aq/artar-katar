import BajarDePesoClient from './BajarDePesoClient';

// Detrás de auth + suscripción: nunca prerenderear estático.
export const dynamic = 'force-dynamic';

export default function BajarDePesoPage() {
  return <BajarDePesoClient />;
}
