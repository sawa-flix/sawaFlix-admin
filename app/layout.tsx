import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AdminNotificationProvider } from '../contexts/AdminNotificationContext';

const inter = Inter({ subsets: ['latin'] });

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
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AdminNotificationProvider>
          {children}
        </AdminNotificationProvider>
      </body>
    </html>
  )
}