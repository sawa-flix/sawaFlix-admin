import type { Metadata } from 'next';

const OG_IMAGE = 'https://i.ibb.co/4HC007J/image.png';
const SITE_URL = 'https://sawaflixplay.vercel.app';
const SITE_NAME = 'Sawaflix';

export const defaultMetadata: Metadata = {
  title: 'Sawaflix - African Music & Culture',
  description: 'Discover authentic African music, traditions, and cultural content on Sawaflix. Stream the best of African entertainment.',
  keywords: [
    'Sawaflix',
    'African music',
    'African culture',
    'streaming',
    'entertainment',
    'traditional music',
    'African artists',
    'cultural content',
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Sawaflix | Discover Authentic African Music & Culture',
    description: 'Stream authentic African music, traditions, and cultural content from across the continent. Discover the best of African entertainment on Sawaflix.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Sawaflix - African Music & Culture',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sawaflix | Stream African Music & Culture',
    description: 'Discover authentic African music, traditions, and cultural entertainment on Sawaflix.',
    creator: '@sawaflix',
    site: '@sawaflix',
    images: {
      url: OG_IMAGE,
      alt: 'Sawaflix - African Music & Culture',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const createPageMetadata = (
  title: string,
  description: string,
  path: string = '/',
  ogImage?: string
): Metadata => {
  const imageUrl = ogImage || OG_IMAGE;
  
  return {
    title: `${title} | Sawaflix`,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: `${title} | Sawaflix`,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Sawaflix`,
      description,
      creator: '@sawaflix',
      site: '@sawaflix',
      images: {
        url: imageUrl,
        alt: title,
      },
    },
  };
};
