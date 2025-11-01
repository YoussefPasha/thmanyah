import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants/app.constants';

const ibmPlexSansArabic = localFont({
  src: [
    {
      path: '../../public/fonts/IBMPlexSansArabic-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBMPlexSansArabic-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBMPlexSansArabic-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBMPlexSansArabic-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBMPlexSansArabic-Text.otf',
      weight: '450',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBMPlexSansArabic-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBMPlexSansArabic-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IBMPlexSansArabic-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-ibm-plex-sans-arabic',
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'ابحث واكتشف البودكاست من مكتبة iTunes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={ibmPlexSansArabic.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

