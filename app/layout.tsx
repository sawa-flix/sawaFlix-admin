import './globals.css';
import type { Metadata } from 'next';
import { AdminNotificationProvider } from '../contexts/AdminNotificationContext';

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

import { Suspense } from 'react';
import TopLoader from '../components/Common/TopLoader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&family=Poppins:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <TopLoader />
        </Suspense>
        <AdminNotificationProvider>
          {children}
        </AdminNotificationProvider>
      </body>
    </html>
  );
}