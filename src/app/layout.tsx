import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'Astar Katar - Pulseras Energéticas y Activaciones Multidimensionales',
  description: 'Portal Multidimensional de Astar Katar por Frank Alexander. Pulseras energéticas activadas multidimensionalmente: abundancia, protección energética, sexualidad, sanación cósmica e intelecto.',
  keywords: [
    'Pulseras Energéticas', 'Sanación Energética', 'Protección Energética', 'Abundancia Universal',
    'Cristales Energéticos', 'Manifestar Abundancia', 'Espiritualidad Consciente', 'Bienestar Holístico',
    'México Espiritual', 'Vibración Alta', 'Ley de la Atracción', 'Conciencia Universal',
    'Sexualidad Consciente', 'Sanación Cósmica', 'Seres Estelares', 'Activación Multidimensional',
    'Geometría Sagrada', 'Energía Vital', 'Expansión de Conciencia', 'Claridad Mental',
  ],
  openGraph: {
    title: 'Astar Katar - Pulseras Energéticas y Activaciones Multidimensionales',
    description: 'Pulseras activadas multidimensionalmente en el portal de Astar Katar. Geometría sagrada cargada con energía vital para tu evolución espiritual.',
    type: 'website',
    locale: 'es_MX',
    siteName: 'Astar Katar',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
                <div className="relative flex min-h-dvh flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
