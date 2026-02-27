import { AuthProvider } from '@/lib/components/common/provider/AuthProvider'
import type { Metadata } from 'next'
import { Header } from '@/lib/components/common/layout/Header'
import { Toaster } from 'sonner'
import { FramerMotionProvider } from '@/lib/components/common/FramerMotionProvider'
import { ModalProviderLazy } from '@/lib/components/common/provider/ModalProviderLazy'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Shopping',
    default: 'Shopping',
  },
  description: '다양한 상품을 경쟁력 있는 가격에 제공하는 온라인 쇼핑몰, Shopping에서 특별한 쇼핑을 경험하세요',
  icons: {
    shortcut: '/favicon.ico',
    icon: [
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16' },
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Shopping',
    description: '다양한 상품을 경쟁력 있는 가격에 제공하는 온라인 쇼핑몰, Shopping에서 특별한 쇼핑을 경험하세요',
    url: 'https://next-auth-test-sage.vercel.app',
    type: 'website',
    images: [
      {
        url: 'https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/open_graph.png',
        width: 1200,
        height: 630,
        alt: '다양한 상품을 경쟁력 있는 가격에 제공하는 온라인 쇼핑몰, Shopping에서 특별한 쇼핑을 경험하세요',
      },
    ],
    locale: 'ko',
    siteName: 'Shopping',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shopping',
    description: '다양한 상품을 경쟁력 있는 가격에 제공하는 온라인 쇼핑몰, Shopping에서 특별한 쇼핑을 경험하세요.',
    images: [
      {
        url: 'https://hhgfywdzkbdfwrhfqlbn.supabase.co/storage/v1/object/public/images/open_graph.png',
        alt: 'Shopping OG Image',
      },
    ],
  },
  generator: 'Next.js',
  keywords: ['온라인 쇼핑몰', '최신 패션', '가전제품', '생활용품', '할인 혜택', '안전 결제', '신속 배송'],
  verification: {
    google: 'gm--g9Pd--R5n3k3bskf7eslJrR-yAsQoSnUBAjNPuA',
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nocache: false,
    noimageindex: false,
    'max-snippet': -1,
    'max-image-preview': 'large',

    googleBot: {
      index: true,
      follow: true,
      noarchive: false,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
}

interface RootLayoutType {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Readonly<RootLayoutType>) {
  return (
    <html lang="ko">
      <AuthProvider>
        <Toaster position="top-center" theme="light" richColors closeButton />
        <Header />
        {children}
        <ModalProviderLazy />
      </AuthProvider>
    </html>
  )
}
