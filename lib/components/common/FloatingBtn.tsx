'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { PiArrowLineUpBold } from 'react-icons/pi'

export const FloatingBtn = () => {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      // 스크롤 영역이 감지되었을 때 버튼을 보여주기
      if (entry.isIntersecting) {
        setIsVisible(false) // 상단 20% 영역에 있을 때 버튼 숨김
      } else {
        setIsVisible(true) // 20%를 넘어가면 버튼 표시
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.2, // 20% 영역을 기준으로 감지
    })

    // 감지할 대상 요소 생성 (페이지 상단을 감지)
    const targetElement = document.createElement('div')
    document.body.prepend(targetElement)

    observerRef.current.observe(targetElement)

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [pathname])

  // 특정 경로에서만 플로팅 버튼이 보이도록 조건부 렌더링
  if (pathname !== '/desired-path' && pathname !== '/') return null

  return (
    <button
      aria-label="scroll to top button"
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 z-20 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <PiArrowLineUpBold className="text-2xl text-white" />
    </button>
  )
}
