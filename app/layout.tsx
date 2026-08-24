import './globals.css';
import type { Metadata } from 'next';
import { Inter, Roboto, Open_Sans, Montserrat, Poppins } from 'next/font/google';
import { AdminNotificationProvider } from '../contexts/AdminNotificationContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://admin.sawaflix.com'),
  title: {
    default: 'SawaFlix Admin | Management Portal',
    template: '%s | SawaFlix Admin',
  },
  description:
    'SawaFlix Administration and Verification Portal. Manage creators, verify applications, and monitor platform metrics.',
  keywords: [
    'SawaFlix',
    'Admin Panel',
    'Creator Verification',
    'Content Management',
  ],
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/Asset 8.svg',
    shortcut: '/Asset 8.svg',
    apple: '/Asset 8.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${poppins.variable}`}
    >
      <body className={inter.className} suppressHydrationWarning>
        <AdminNotificationProvider>
          {children}
        </AdminNotificationProvider>
      </body>
    </html>
  );
}