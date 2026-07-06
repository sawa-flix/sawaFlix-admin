import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AdminNotificationProvider } from '../contexts/AdminNotificationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sawaflixplay.vercel.app'),
  title: {
    default: 'Sawaflix | African Music, Culture & Entertainment',
    template: '%s | Sawaflix',
  },
  description:
    'Sawaflix is your gateway to authentic African music, traditions, and cultural content. Stream the best of African entertainment from across the continent.',
  keywords: [
    'Sawaflix',
    'African music',
    'African culture',
    'streaming',
    'entertainment',
    'traditional music',
    'African artists',
  ],
  openGraph: {
    url: 'https://sawaflixplay.vercel.app',
    type: 'website',
    title: 'Sawaflix | Discover Authentic African Music & Culture',
    description:
      'Stream authentic African music, traditions, and cultural content from across the continent.',
    siteName: 'Sawaflix',
    images: [
      {
        url: 'https://i.ibb.co/4HC007J/image.png',
        width: 1200,
        height: 630,
        alt: 'Sawaflix - African Music & Culture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sawaflix | Stream African Music & Culture',
    description:
      'Discover authentic African music, traditions, and cultural entertainment.',
    creator: '@sawaflix',
    images: ['https://i.ibb.co/4HC007J/image.png'],
  },
  robots: {
    index: true,
    follow: true,
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