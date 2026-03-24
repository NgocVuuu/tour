import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: {
    default: 'DaNang Private Transfer — Airport & City Transfers',
    template: '%s | DaNang Private Transfer',
  },
  description:
    'Private car transfers in Da Nang, Vietnam. Airport to Hoi An, Ba Na Hills, and more. English-speaking drivers, fixed prices, no hidden fees.',
  keywords: ['Da Nang transfer', 'Hoi An private car', 'Da Nang airport taxi', 'Vietnam transfer'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'DaNang Private Transfer — Airport & City Transfers',
    description: 'Dịch vụ xe riêng đưa đón sân bay và tham quan miền Trung chuyên nghiệp, giá rẻ.',
    images: ['https://photo-link-talk.zadn.vn/photolinkv2/720/zlv27e944c52fc1774356013aHR0cHM6Ly9yZXMtemFsby56YWRuLnZuL3VwbG9hZC9tZWRpYS8yMDE5LzEwLzE1L2ZlZWRfdGh1bWJfbGlua19fMV9fMTU3MTEzMzEyMjc3OF85Mzc4MC5wbmc='],
  },
  verification: {
    other: {
      'zalo-platform-site-verification': ['VD-K2ulN4WzPzPqJfU8R6dFfkp6VdsvlDJKv'],
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

