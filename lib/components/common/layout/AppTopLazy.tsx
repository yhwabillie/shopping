'use client'

import dynamic from 'next/dynamic'

const HeaderLazy = dynamic(() => import('@/lib/components/common/layout/Header').then((m) => m.Header), {
  ssr: false,
  loading: () => (
    <header className="h-15 sticky left-0 top-0 z-40 w-full border-b border-gray-200/60 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-full w-[calc(100%-40px)] items-center justify-between">
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-[42%] max-w-md animate-pulse rounded-full bg-gray-200" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      </div>
    </header>
  ),
})

const ToasterLazy = dynamic(() => import('sonner').then((m) => m.Toaster), {
  ssr: false,
})

export const AppTopLazy = () => {
  return (
    <>
      <ToasterLazy position="top-center" theme="light" richColors closeButton />
      <HeaderLazy />
    </>
  )
}
