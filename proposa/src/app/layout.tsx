import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Proposa — AI-Powered Proposals for European Service Businesses',
  description: 'Win more deals. Write fewer proposals. Generate professional, tailored proposals in minutes with AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
