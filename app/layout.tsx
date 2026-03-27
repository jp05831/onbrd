import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  icons: {
  icon: '/favicon.ico?v=2',
  apple: '/apple-touch-icon.png?v=2',
},
  title: {
    default: 'Onbrd – Client Onboarding Portal Builder',
    template: '%s | Onbrd',
  },
  description:
    'Build beautiful client onboarding portals in minutes. Create step-by-step flows, share one link, and track your clients through every step — no friction, no confusion.',
  metadataBase: new URL('https://www.onbrd.net'),
  alternates: {
    canonical: '/',
  },
  keywords: [
    'client onboarding portal',
    'client onboarding software',
    'onboarding portal builder',
    'client portal',
    'client onboarding tool',
    'onboarding workflow',
    'client onboarding checklist',
    'customer onboarding software',
  ],
  openGraph: {
    title: 'Onbrd – Client Onboarding Portal Builder',
    description:
      'Build beautiful client onboarding portals in minutes. Create step-by-step flows, share one link, and track your clients through every step.',
    url: 'https://www.onbrd.net',
    siteName: 'Onbrd',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Onbrd – Client Onboarding Portal Builder',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Onbrd – Client Onboarding Portal Builder',
    description:
      'Build beautiful client onboarding portals in minutes. One link, no confusion, no friction.',
    images: ['/og-image.png'],
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
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Onbrd',
  url: 'https://www.onbrd.net',
  description:
    'Client onboarding portal builder. Create professional step-by-step onboarding flows, share one link with your clients, and track progress — all in one place.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    {
      '@type': 'Offer',
      name: 'Free',
      price: '0',
      priceCurrency: 'USD',
      url: 'https://www.onbrd.net/signup',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '15',
      priceCurrency: 'USD',
      url: 'https://www.onbrd.net/signup',
    },
  ],
  publisher: {
    '@type': 'Organization',
    name: 'Onbrd',
    url: 'https://www.onbrd.net',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.onbrd.net/logo-dark.png',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1475313064241503');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1475313064241503&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="min-h-screen bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
