'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

enum TooltipTypes {
  NONE = 'NONE',
  PROFILE = 'PROFILE',
  CART = 'CART',
  WISH = 'WISH',
  DROP_DWN = 'DROP_DWN',
  ADD_PRODUCT = 'ADD_PRODUCT',
}

export const Header = () => {
  const [activeModal, setActiveModal] = useState(TooltipTypes.NONE)
  const showTooltip = (type: TooltipTypes) => setActiveModal(type)
  const closeTooltip = () => setActiveModal(TooltipTypes.NONE)
  const { data: session, status } = useSession()
  const isAdmin = status === 'authenticated' && session && session.user && session.user.user_type === 'admin'

  return (
    <header className="sticky top-0 z-10 h-[80px] bg-blue-400/50 backdrop-blur-md">
      <div className="mx-auto flex h-full w-[768px] items-center justify-between px-5">
        <nav className="flex flex-row gap-3">
          <ul className="flex flex-row gap-3">
            <li>
              <h1>
                <Link href="/">MAIN</Link>
              </h1>
            </li>
            <li>
              <Link href="/products">PRODUCTS</Link>
            </li>
          </ul>
        </nav>

        <nav className="flex items-center">
          {status === 'loading' && (
            <div className="flex gap-3">
              <Skeleton width={75} height={40} />
              <Skeleton width={75} height={40} />
            </div>
          )}

          <div className="flex items-center gap-3">
            {status === 'authenticated' && session && session.user && session.user.user_type === 'indivisual' && (
              <div className="relative">
                <Link
                  href="/my-shopping"
                  onMouseEnter={() => showTooltip(TooltipTypes.CART)}
                  onMouseLeave={() => closeTooltip()}
                  className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-blue-400 text-center text-sm text-white shadow-lg hover:bg-blue-600"
                >
                  <span className="sr-only">마이쇼핑 - 장바구니</span>
                  <span className="absolute right-[-10px] top-[-10px] box-border block h-6 w-6 rounded-[50%] bg-red-500 text-center text-xs leading-[24px] shadow-lg">
                    {session.user.cartlist_length}
                  </span>
                  <FaShoppingCart className="text-lg text-white" />
                </Link>
                {activeModal === TooltipTypes.CART && (
                  <span className="absolute bottom-[-35px] left-[50%] box-border block w-[70px] translate-x-[-50%] rounded-md bg-gray-700 px-3 py-2 text-center text-xs text-white shadow-lg">
                    마이쇼핑
                  </span>
                )}
              </div>
            )}

            {isAdmin && (
              <div className="relative">
                <Link
                  href="/add-product"
                  onMouseEnter={() => showTooltip(TooltipTypes.ADD_PRODUCT)}
                  onMouseLeave={() => closeTooltip()}
                  className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-blue-400 text-center text-sm text-white shadow-lg hover:bg-blue-600"
                >
                  <span className="sr-only">상품등록</span>
                  <FaShoppingCart className="text-lg text-white" />
                </Link>
                {activeModal === TooltipTypes.ADD_PRODUCT && (
                  <span className="absolute bottom-[-35px] left-[50%] box-border block w-[70px] translate-x-[-50%] rounded-md bg-gray-700 px-3 py-2 text-center text-xs text-white shadow-lg">
                    상품등록
                  </span>
                )}
              </div>
            )}

            {status === 'authenticated' && session && session.user && (
              <div className="relative">
                <button
                  onMouseEnter={() => showTooltip(TooltipTypes.PROFILE)}
                  onClick={() => showTooltip(TooltipTypes.DROP_DWN)}
                  className="block h-10 w-10 overflow-hidden rounded-[50%] border-2 border-gray-600/40 bg-white shadow-lg hover:border-blue-600"
                >
                  <span className="sr-only">사용자 프로필 이미지</span>
                  {session.user.profile_img === 'undefined' ? (
                    <Image src="/images/default_profile.jpeg" className="object-cover" alt="user profile" width={40} height={40} />
                  ) : (
                    <Image src={session.user.profile_img!} className="object-cover" alt="user profile" width={40} height={40} />
                  )}
                </button>

                {activeModal === TooltipTypes.PROFILE && (
                  <span className="absolute bottom-[-35px] left-[50%] box-border block w-[80px] translate-x-[-50%] rounded-md bg-gray-700 px-3 py-2 text-center text-xs text-white shadow-lg">
                    회원정보
                  </span>
                )}
                {activeModal === TooltipTypes.DROP_DWN && (
                  <div
                    onMouseLeave={() => closeTooltip()}
                    className="absolute right-0 top-[50px] w-[200px] rounded-lg bg-gray-600/95 p-5 shadow-lg backdrop-blur-lg"
                  >
                    <h3 className="sr-only">사용자 메뉴 드롭다운</h3>
                    <h4 className="block border-b-[1px] border-white/50 pb-2 text-center font-medium text-white">
                      <strong className="block text-xs font-medium">{session.user.user_type === 'indivisual' ? '일반 사용자' : '관리자'}</strong>
                      <span>{session.user.name}</span> 님
                    </h4>
                    <Link
                      href="/profile"
                      className="mt-4 block text-center text-sm text-white/80 transition-all duration-150 ease-in-out hover:text-white"
                    >
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
            )}
          </div>

          {status === 'unauthenticated' && (
            <div className="flex gap-3">
              <Link
                href="/signIn"
                className="box-border rounded-md bg-blue-400 px-5 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-500"
              >
                Login
              </Link>
              <Link
                href="/signUp/agreement"
                className="leading-1 box-border rounded-md bg-pink-400 px-5 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-pink-500"
              >
                회원가입
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
