import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/unbounded';
import '@fontsource-variable/manrope';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Konoha Hardware',
  description:
    'Entenda as peças de um computador, monte um PC só com peças compatíveis e veja preço e desempenho estimado antes de comprar.',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
