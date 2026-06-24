import './globals.css';
import { Tajawal, JetBrains_Mono } from 'next/font/google';
import Providers from '@/components/Providers';
import AppShell from '@/components/AppShell';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'لبنان فون ستور — هواتف ذكية وإكسسوارات',
  description: 'متجر لبنان فون ستور — وجهتك الأولى للهواتف الذكية والإكسسوارات في لبنان بأفضل الأسعار',
  icons: {
    icon: '/vite.svg',
  },
};

export const viewport = {
  themeColor: '#0B1430',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
