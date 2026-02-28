'use client'
import { TooltipTypes } from '@/lib/components/common/layout/Header'
import clsx from 'clsx'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface UserMenuDropdownProps {
  sessionUser: Session['user']
  isScrolled: boolean
}

export const UserMenuDropdown = ({ sessionUser, isScrolled }: UserMenuDropdownProps) => {
  const [activeTooltip, setActiveTooltip] = useState(TooltipTypes.NONE)
  const showTooltip = (type: TooltipTypes) => setActiveTooltip(type)
  const closeTooltip = () => setActiveTooltip(TooltipTypes.NONE)

  return (
    <div className="relative">
      <button
        onClick={() => showTooltip(TooltipTypes.DROP_DWN)}
        className="block h-10 w-10 cursor-pointer overflow-hidden rounded-[50%] border-2 border-gray-300 bg-white shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      >
        <span className="sr-only">사용자 프로필 이미지</span>
        {sessionUser?.profile_img === 'undefined' ? (
          <Image src="/images/default_profile.jpeg" className="object-cover" alt="user profile" width={40} height={40} />
        ) : (
          <Image src={sessionUser?.profile_img!} className="object-cover" alt="user profile" width={40} height={40} />
        )}
      </button>

      {activeTooltip === TooltipTypes.DROP_DWN && (
        <div
          onMouseLeave={() => closeTooltip()}
          className="absolute right-0 top-[50px] w-[200px] rounded-lg bg-gray-600/95 p-5 shadow-lg backdrop-blur-lg"
        >
          <h3 className="sr-only">사용자 메뉴 드롭다운</h3>
          <h4 className="block border-b-[1px] border-white/50 pb-2 text-center font-medium text-white">
            <strong className="block text-xs font-medium">{sessionUser?.user_type === 'indivisual' ? '일반 사용자' : '관리자'}</strong>
            <span>{sessionUser?.name}</span> 님
          </h4>
          <Link href="/profile" className="mt-4 block text-center text-sm text-white/80 transition-all duration-150 ease-in-out hover:text-white">
            회원정보
          </Link>
          <div className="mt-4">
            <button
              onClick={() => signOut({ callbackUrl: '/signIn' })}
              className="box-border w-full rounded-md bg-blue-400 px-5 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-500"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
