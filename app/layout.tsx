import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

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
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
