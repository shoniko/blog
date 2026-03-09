import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://proposa.eu'

export const metadata: Metadata = {
  title: 'Proposa — AI-Powered Proposals for European Service Businesses',
  description: 'Win more deals. Write fewer proposals. Generate professional, tailored proposals in minutes with AI.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Proposa — AI-Powered Proposals',
    description: 'Generate professional, tailored proposals in minutes with AI. Built for European B2B service businesses.',
    url: siteUrl,
    siteName: 'Proposa',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proposa — AI-Powered Proposals',
    description: 'Generate professional, tailored proposals in minutes with AI.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('consent', 'default', {
                  'analytics_storage': 'granted',
                  'ad_storage': 'denied'
                });
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                  send_page_view: true,
                });
              `}
            </Script>
          </>
        )}

        {/* Plausible Analytics — privacy-friendly, no cookies, GDPR-compliant */}
        {plausibleDomain && (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
