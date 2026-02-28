'use client'
import Link from 'next/link'
import { useState } from 'react'
import { TooltipTypes } from '@/lib/components/common/layout/Header'
import { Session } from 'next-auth'
import clsx from 'clsx'

interface UserNavItemProps {
  sessionUser?: Session['user']
  children: React.ReactNode
  label: string
  path: string
  type?: TooltipTypes
  isScrolled?: boolean
}

export const UserNavItem = ({ sessionUser, children, label, path, type, isScrolled }: UserNavItemProps) => {
  const [activeTooltip, setActiveTooltip] = useState(TooltipTypes.NONE)
  const showTooltip = (type: TooltipTypes) => setActiveTooltip(type)
  const closeTooltip = () => setActiveTooltip(TooltipTypes.NONE)

  return (
    <div className="relative">
      <Link
        aria-label={label}
        href={path}
        onMouseEnter={() => {
          if (type) {
            showTooltip(type)
          }
        }}
        onMouseLeave={() => {
          if (type) {
            closeTooltip()
          }
        }}
        className={clsx(
          'box-border flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5',
          {
            'bg-white !text-accent': isScrolled,
          },
        )}
      >
        {sessionUser && sessionUser.cartlist_length! > 0 && (
          <span className="absolute right-[-10px] top-[-6px] box-border block h-6 w-6 rounded-[50%] bg-red-400 text-center text-xs font-semibold leading-[24px] text-white shadow-inner">
            {sessionUser?.cartlist_length}
          </span>
        )}

        {children}
      </Link>
      {activeTooltip === type && (
        <span className="absolute bottom-[-35px] left-[50%] box-border block w-[70px] translate-x-[-50%] rounded-md bg-accent px-3 py-2 text-center text-xs text-white shadow-lg">
          {label}
        </span>
      )}
    </div>
  )
}
