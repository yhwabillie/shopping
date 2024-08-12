'use client'
import { useAddressStore } from '@/lib/stores/addressStore'
import { SessionProvider } from 'next-auth/react'
import { useModalStore } from '../zustandStore'
import clsx from 'clsx'

interface ProvidersProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: ProvidersProps) => {
  const { modalState } = useModalStore()
  const { modals } = useAddressStore()
  const address_modal_state = Object.values(modals).some((item) => item === true)

  return (
    <SessionProvider>
      <body
        className={clsx('bg-gray-200', {
          'overflow-hidden': modalState || address_modal_state,
        })}
      >
        {children}
      </body>
    </SessionProvider>
  )
}
