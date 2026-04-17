import type {Metadata} from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'FoodSaver BD | Save Food. Save Money.',
  description: 'Join the movement to reduce food waste in Bangladesh. Discover surplus meals from local restaurants and bakeries at discounted prices.',
  openGraph: {
    title: 'FoodSaver BD | Save Food. Save Money.',
    description: 'Join the movement to reduce food waste in Bangladesh. Discover surplus meals from local restaurants and bakeries at discounted prices.',
    type: 'website',
    locale: 'en_US',
    url: 'https://foodsaverbd.com',
    siteName: 'FoodSaver BD',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${playfair.variable} min-h-screen flex flex-col bg-slate-50 text-slate-900 font-[family-name:var(--font-manrope)]`}
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
