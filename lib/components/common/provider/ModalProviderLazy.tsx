'use client'

import dynamic from 'next/dynamic'

const ModalProvider = dynamic(() => import('@/lib/components/common/provider/ModalProvider').then((m) => m.ModalProvider), {
  ssr: false,
})

export const ModalProviderLazy = () => {
  return <ModalProvider />
}
