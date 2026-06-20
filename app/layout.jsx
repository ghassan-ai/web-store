import './globals.css';
import Providers from '@/components/Providers';
import AppShell from '@/components/AppShell';

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
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
