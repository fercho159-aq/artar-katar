import BibliotecaClient from './BibliotecaClient';

// Página detrás de auth + suscripción: nunca debe prerenderearse estática.
// (Evita un bug del React Client Manifest de Next 15.5 al compartir el
//  componente AudioPlayer con otras rutas.)
export const dynamic = 'force-dynamic';

export default function BibliotecaPage() {
  return <BibliotecaClient />;
}
