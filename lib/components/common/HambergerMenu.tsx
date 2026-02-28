import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { GoSignIn } from 'react-icons/go'
import { FaUserPen } from 'react-icons/fa6'
import Image from 'next/image'
import { FaShoppingCart } from 'react-icons/fa'
import { LuLogOut } from 'react-icons/lu'
import { UserNavItem } from './modules/UserNavItem'
import { FaUserCog } from 'react-icons/fa'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useBodyScrollStore } from '@/lib/zustandStore'

interface HambergerMenuProps {
  sessionUser: any
  isIndivisual: boolean | undefined
  isAdmin: boolean | undefined
  isAuth: any
  isGuest: boolean | undefined
  isScrolled: boolean | undefined
}

export const HamburgerMenu = ({ sessionUser, isIndivisual, isAdmin, isAuth, isGuest, isScrolled }: HambergerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMenuMounted, setIsMenuMounted] = useState(false)
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { disableScroll, enableScroll } = useBodyScrollStore()

  const closeMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }

    setIsOpen(false)
    enableScroll()
    triggerButtonRef.current?.focus()

    closeTimerRef.current = setTimeout(() => {
      setIsMenuMounted(false)
    }, 300)
  }

  const toggleMenu = () => {
    if (isOpen || isMenuMounted) {
      closeMenu()
      return
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }

    setIsMenuMounted(true)
    disableScroll()

    requestAnimationFrame(() => {
      setIsOpen(true)
    })
  }

  useEffect(() => {
    const desktopMq = window.matchMedia('(min-width: 1024px)')

    const handleResize = () => {
      // lg 이상에서는 강제로 닫아 레이아웃 깨짐 방지
      if (desktopMq.matches) {
        closeMenu()
      }
    }

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeMenu()
      }
    }

    window.addEventListener('resize', handleResize)
    desktopMq.addEventListener('change', handleDesktopChange)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      desktopMq.removeEventListener('change', handleDesktopChange)
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
      enableScroll()
    }
  }, [])

  return (
    <>
      <button
        ref={triggerButtonRef}
        aria-label="sidemenu button"
        className="relative z-[100] flex h-8 w-8 cursor-pointer items-center justify-center"
        onClick={toggleMenu}
      >
        <div
          className={clsx('absolute h-[3px] w-6 rounded-md shadow-md transition-all duration-300 ease-in-out', {
            'translate-y-0 rotate-45': isOpen,
            '-translate-y-[7px] rotate-0': !isOpen,
            'bg-gray-700': (isOpen && isScrolled) || (isOpen && !isScrolled),
            'bg-white': isScrolled && !isOpen,
            'bg-primary': !isScrolled && !isOpen,
          })}
        />

        <div
          className={clsx('absolute h-[3px] w-6 rounded-md shadow-md transition-all duration-200 ease-in-out', {
            'opacity-0': isOpen,
            'opacity-100': !isOpen,
            'bg-white': isScrolled,
            'bg-primary': !isScrolled,
          })}
        />

        <div
          className={clsx('absolute h-[3px] w-6 rounded-md shadow-md transition-all duration-300 ease-in-out', {
            'translate-y-0 -rotate-45': isOpen,
            'translate-y-[7px] rotate-0': !isOpen,
            'bg-gray-700': (isOpen && isScrolled) || (isOpen && !isScrolled),
            'bg-white': isScrolled && !isOpen,
            'bg-primary': !isScrolled && !isOpen,
          })}
        />
      </button>

      {isMenuMounted && (
        <>
          <div
            onClick={closeMenu}
            className={clsx('fixed inset-0 z-[70] bg-black/50 transition-opacity duration-300', {
              'pointer-events-auto opacity-100': isOpen,
              'pointer-events-none opacity-0': !isOpen,
            })}
            style={{ height: '100vh' }}
          />
          <div
            className={clsx('fixed inset-y-0 right-0 z-[80] w-2/3 bg-gray-200 shadow-inner transition-transform duration-300 sm:w-[35%]', {
              'translate-x-0': isOpen,
              'translate-x-full': !isOpen,
            })}
          >
            {/* 관리자 */}
            {isAdmin && (
              <section className="flex h-screen flex-1 flex-col overflow-y-auto bg-white px-5 pt-20">
                <picture className="mx-auto mb-4 block h-[100px] w-[100px] overflow-hidden rounded-[50%] bg-gray-400/50">
                  <Image
                    src={sessionUser.profile_img === 'undefined' ? '/images/default_profile.jpeg' : sessionUser.profile_img}
                    width={100}
                    height={100}
                    alt="회원 프로필 이미지"
                  />
                </picture>
                <p className="mx-auto w-fit text-sm font-semibold text-blue-600">{sessionUser.user_type === 'indivisual' ? '일반회원' : '관리자'}</p>
                <p className="mx-auto mb-10 w-fit text-lg font-semibold text-gray-700">{sessionUser.name}</p>

                <ul className="flex flex-col justify-center gap-3">
                  <li className="rounded-md bg-white hover:bg-gray-300/50">
                    <Link
                      href="/add-product"
                      onClick={() => {
                        closeMenu()
                      }}
                      className="flex w-full items-center gap-3"
                    >
                      <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                        <FaShoppingCart className="text-lg" />
                      </span>
                      <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">상품등록</span>
                    </Link>
                  </li>
                  <li className="rounded-md bg-white hover:bg-gray-300/50">
                    <Link
                      href="/profile"
                      onClick={() => {
                        closeMenu()
                      }}
                      className="flex w-full items-center gap-3"
                    >
                      <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                        <FaUserCog className="text-lg" />
                      </span>
                      <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">회원정보</span>
                    </Link>
                  </li>
                  <li className="rounded-md bg-white hover:bg-gray-300/50">
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/signIn' })
                        closeMenu()
                      }}
                      className="flex w-full items-center gap-3"
                    >
                      <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                        <LuLogOut className="text-lg" />
                      </span>
                      <span className="inline-block w-[calc(100%-(24px+0.5rem))] text-left font-semibold">로그아웃</span>
                    </button>
                  </li>
                </ul>
              </section>
            )}

            {/* 일반회원 */}
            {isIndivisual && (
              <section className="flex h-screen flex-1 flex-col overflow-y-auto bg-white px-5 pt-20">
                <picture className="mx-auto mb-4 block h-[100px] w-[100px] overflow-hidden rounded-[50%] bg-gray-400/50">
                  <Image
                    src={sessionUser.profile_img === 'undefined' ? '/images/default_profile.jpeg' : sessionUser.profile_img}
                    width={100}
                    height={100}
                    alt="회원 프로필 이미지"
                  />
                </picture>
                <p className="mx-auto w-fit text-sm font-semibold text-blue-600">{sessionUser.user_type === 'indivisual' ? '일반회원' : '관리자'}</p>
                <p className="mx-auto mb-10 w-fit text-lg font-semibold text-gray-700">{sessionUser.name}</p>

                <ul className="flex flex-col justify-center gap-3">
                  <li className="rounded-md bg-white hover:bg-gray-300/50">
                    <Link
                      href="/my-shopping"
                      onClick={() => {
                        closeMenu()
                      }}
                      className="flex w-full items-center gap-3"
                    >
                      <span className="relative box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                        {sessionUser && sessionUser.cartlist_length! > 0 && (
                          <span className="absolute right-[-10px] top-[-6px] box-border block h-6 w-6 rounded-[50%] bg-red-400 text-center text-xs font-semibold leading-[24px] text-white shadow-inner">
                            {sessionUser?.cartlist_length}
                          </span>
                        )}
                        <FaShoppingCart className="text-lg" />
                      </span>
                      <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">마이쇼핑</span>
                    </Link>
                  </li>
                  <li className="rounded-md bg-white hover:bg-gray-300/50">
                    <Link
                      href="/profile"
                      onClick={() => {
                        closeMenu()
                      }}
                      className="flex w-full items-center gap-3"
                    >
                      <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                        <FaUserCog className="text-lg" />
                      </span>
                      <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">회원정보</span>
                    </Link>
                  </li>
                  <li className="rounded-md bg-white hover:bg-gray-300/50">
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/signIn' })
                        closeMenu()
                      }}
                      className="flex w-full items-center gap-3"
                    >
                      <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                        <LuLogOut className="text-lg" />
                      </span>
                      <span className="inline-block w-[calc(100%-(24px+0.5rem))] text-left font-semibold">로그아웃</span>
                    </button>
                  </li>
                </ul>
              </section>
            )}

            {/* 비회원 */}
            {isGuest && (
              <ul className="flex h-screen flex-1 flex-col gap-3 overflow-y-auto bg-white px-5 pt-20">
                <li className="rounded-md bg-white hover:bg-gray-300/50">
                  <Link
                    href="/signIn"
                    onClick={() => {
                      closeMenu()
                    }}
                    className="flex w-full items-center gap-3"
                  >
                    <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                      <FaUserCog className="text-lg" />
                    </span>
                    <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">로그인</span>
                  </Link>
                </li>
                <li className="rounded-md bg-white hover:bg-gray-300/50">
                  <Link
                    href="/signUp/agreement"
                    onClick={() => {
                      closeMenu()
                    }}
                    className="flex w-full items-center gap-3"
                  >
                    <span className="box-border flex h-[40px] w-[40px] items-center justify-center rounded-md bg-accent text-center text-sm text-white shadow-lg ">
                      <FaUserCog className="text-lg" />
                    </span>
                    <span className="inline-block w-[calc(100%-(24px+0.5rem))] font-semibold">회원가입</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </>
      )}
    </>
  )
}
