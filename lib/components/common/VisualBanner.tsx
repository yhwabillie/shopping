'use client'
import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import Image from 'next/image'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'

const bannerList = [
  {
    id: 1,
    title: '요가 루틴 <br /> 밸런스 케어',
    description: '호흡에 집중하는 홈 트레이닝 <br /> 요가복·매트·소도구 기획전',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-01-mobile.avif`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-01-tablet.avif`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-01.avif`,
    banner_alt: '요가하는 사람의 모습 배너 이미지',
  },
  {
    id: 2,
    title: '블루비치 <br/> 캠핑 체어 무드',
    description: '푸른 바다와 모래사장 앞에서 즐기는 <br/> 감성 캠핑·피크닉 컬렉션',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-02-mobile.avif`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-02-tablet.avif`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-2.avif`,
    banner_alt: '관광지 바다 관경 배너 이미지',
  },
  {
    id: 3,
    title: '아티장 베이커리 <br/> 바게트 셀렉션',
    description: '겉은 바삭하고 속은 촉촉한 <br/> 프리미엄 브레드 라인업.',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-03-mobile.avif`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-03-tablet.avif`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-03.avif`,
    banner_alt: '방울 토마토가 여러개 열려있는 모습 배너 이미지',
  },
  {
    id: 4,
    title: '파인 다이닝 <br/> 씨푸드 오마카세',
    description: '정교하게 플레이팅된 조개 스시로 <br/> 완성한 프리미엄 미식 경험',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-04-mobile.avif`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-04-tablet.avif`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-04.avif`,
    banner_alt: '애플 스토어 로고 배너 이미지',
  },
]

const BANNER_BG_COLOR = '#6b7280'

const withAlpha = (color: string, alpha: number) => {
  if (!color || color === 'transparent') return 'transparent'

  if (color.startsWith('rgb(')) {
    const values = color
      .replace('rgb(', '')
      .replace(')', '')
      .split(',')
      .map((v) => Number(v.trim()))

    if (values.length !== 3) return color

    return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`
  }

  if (color.startsWith('#')) {
    let hex = color.replace('#', '')
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('')
    }

    if (hex.length !== 6) return color

    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return color
}

const getContrastTextColor = (color: string) => {
  const normalized = color?.trim()
  if (!normalized || normalized === 'transparent') return '#ffffff'

  let r = 255
  let g = 255
  let b = 255

  if (normalized.startsWith('rgb(')) {
    const values = normalized
      .replace('rgb(', '')
      .replace(')', '')
      .split(',')
      .map((v) => Number(v.trim()))

    if (values.length === 3) {
      r = values[0]
      g = values[1]
      b = values[2]
    }
  } else if (normalized.startsWith('#')) {
    let hex = normalized.replace('#', '')

    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('')
    }

    if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16)
      g = parseInt(hex.slice(2, 4), 16)
      b = parseInt(hex.slice(4, 6), 16)
    }
  }

  const toLinear = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }

  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  const contrastWithWhite = 1.05 / (luminance + 0.05)
  const contrastWithBlack = (luminance + 0.05) / 0.05

  // WCAG 대비비가 더 큰 색상을 선택 (가장 크게 차이나는 색상)
  return contrastWithWhite >= contrastWithBlack ? '#ffffff' : '#111111'
}

export const VisualBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const swiperRef = useRef<SwiperType | null>(null)

  const getViewportMode = () => {
    if (window.matchMedia('(max-width: 767px)').matches) return 'mobile' as const
    if (window.matchMedia('(max-width: 1279px)').matches) return 'tablet' as const
    return 'desktop' as const
  }

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex)
  }

  const handlePrev = () => {
    swiperRef.current?.slidePrev()
  }

  const handleNext = () => {
    const swiper = swiperRef.current
    if (!swiper) return

    swiper.slideNext()
  }

  const handleTogglePlay = () => {
    const swiper = swiperRef.current
    if (!swiper?.autoplay) return

    if (isPlaying) {
      swiper.autoplay.stop()
      setIsPlaying(false)
      return
    }

    swiper.autoplay.start()
    setIsPlaying(true)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsResizing(true)

      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current)
      }

      resizeTimerRef.current = setTimeout(() => {
        setViewportMode(getViewportMode())
        setIsResizing(false)

        const swiper = swiperRef.current
        if (swiper) {
          swiper.update()
        }
      }, 120)
    }

    const handleViewportModeChange = () => {
      setViewportMode(getViewportMode())
    }

    const mobileMq = window.matchMedia('(max-width: 767px)')
    const tabletMq = window.matchMedia('(min-width: 768px) and (max-width: 1279px)')

    setViewportMode(getViewportMode())
    window.addEventListener('resize', handleResize)
    window.visualViewport?.addEventListener('resize', handleResize)
    mobileMq.addEventListener('change', handleViewportModeChange)
    tabletMq.addEventListener('change', handleViewportModeChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.visualViewport?.removeEventListener('resize', handleResize)
      mobileMq.removeEventListener('change', handleViewportModeChange)
      tabletMq.removeEventListener('change', handleViewportModeChange)
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current)
      }
    }
  }, [])

  const activeBgColor = BANNER_BG_COLOR
  const activeTextColor = getContrastTextColor(activeBgColor)

  const getResponsiveImageSrc = (banner: (typeof bannerList)[number]) => {
    if (viewportMode === 'mobile') return banner.mobile_image
    if (viewportMode === 'tablet') return banner.tablet_image
    return banner.desktop_image
  }

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper?.autoplay) return

    if (isResizing || isHovering) {
      swiper.autoplay.stop()
      return
    }

    if (isPlaying) {
      swiper.autoplay.start()
      return
    }

    // 사용자가 정지한 상태에서는 리사이즈 후에도 강제로 정지 유지
    swiper.autoplay.stop()
  }, [isResizing, isPlaying, isHovering])

  const currentSlideText = String(activeIndex + 1).padStart(2, '0')
  const totalSlideText = String(bannerList.length).padStart(2, '0')

  return (
    <Swiper
      onSwiper={(swiper) => {
        swiperRef.current = swiper
      }}
      onMouseEnter={() => {
        setIsHovering(true)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
      }}
      className={isResizing ? 'h-full [&_.swiper-slide]:!transition-none [&_.swiper-wrapper]:!transition-none' : 'h-full'}
      modules={[Autoplay]}
      autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
      centeredSlides={false}
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      speed={isResizing ? 0 : 900}
      allowTouchMove={!isResizing}
      updateOnWindowResize={false}
      roundLengths={true}
      onSlideChange={handleSlideChange}
    >
      {bannerList.map((banner, index) => (
        <SwiperSlide key={banner.id}>
          {(() => {
            const isActiveSlide = activeIndex === index

            return (
              <div className="aspect-[2/3] md:aspect-[640/427] lg:aspect-[512/175]">
                <div
                  className={
                    isResizing
                      ? 'container relative mx-auto flex h-full items-center overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24'
                      : 'container relative mx-auto flex h-full items-start overflow-hidden px-4 pt-[30%] sm:items-center sm:px-6 sm:pt-0 md:px-10 lg:px-16 xl:px-24'
                  }
                >
                  <div
                    className={`z-1 relative mx-auto flex w-[90%] max-w-[560px] flex-col items-center px-4 py-5 text-center duration-700 sm:w-[74%] sm:px-5 sm:py-6 md:mx-0 md:w-[64%] md:items-start md:px-7 md:py-7 md:text-left lg:w-[58%] lg:max-w-[680px] ${isResizing ? 'transition-none' : 'transition-all'} ${isActiveSlide ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-80'}`}
                  >
                    <h3
                      className={`relative text-[clamp(1.4rem,4.1vw,3.25rem)] font-bold leading-[1.35] drop-shadow-[0_2px_8px_rgba(0,0,0,0.36)] delay-300 duration-700 ${isResizing ? 'transition-none' : 'transition-all'} ${isActiveSlide ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                      style={{
                        color: activeTextColor,
                      }}
                      dangerouslySetInnerHTML={{ __html: banner.title }}
                    />
                    <p
                      className={`delay-450 mt-[clamp(0.45rem,0.95vw,0.78rem)] text-[clamp(0.9rem,1.65vw,1.15rem)] leading-[1.6] drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] duration-700 ${isResizing ? 'transition-none' : 'transition-all'} ${isActiveSlide ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'}`}
                      style={{
                        color: withAlpha(activeTextColor, 0.92),
                      }}
                      dangerouslySetInnerHTML={{ __html: banner.description }}
                    />
                    <button
                      type="button"
                      className={`delay-550 bg-white/18 hover:bg-white/26 group mt-[clamp(0.95rem,2.1vw,1.5rem)] inline-flex min-h-[2.5rem] cursor-pointer items-center gap-2 rounded-full border border-white/50 px-[clamp(1.2rem,2.4vw,1.7rem)] py-[clamp(0.5rem,1.05vw,0.74rem)] text-[clamp(0.9rem,1.28vw,1.06rem)] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl backdrop-saturate-150 duration-500 hover:-translate-y-0.5 hover:border-white/70 hover:text-white hover:shadow-[0_14px_30px_rgba(255,255,255,0.2)] ${isResizing ? 'transition-none' : 'transition-all'} ${isActiveSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                      <span className="transition-transform duration-150 group-hover:translate-x-0.5">자세히 보기</span>
                      <svg
                        aria-hidden
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-[0.95em] w-[0.95em] transition-transform duration-150 group-hover:translate-x-1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <Image
                  key={`${banner.id}-${viewportMode}`}
                  src={getResponsiveImageSrc(banner)}
                  alt={banner.banner_alt}
                  width={1920}
                  height={1080}
                  className="absolute left-1/2 top-0 h-full w-[calc(100%-32px)] -translate-x-1/2 rounded-[20px] object-cover sm:rounded-[28px] md:rounded-[36px] xl:rounded-[54px]"
                  quality={100}
                  sizes="100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            )
          })()}
        </SwiperSlide>
      ))}

      <button
        type="button"
        aria-label="visual banner previous slide"
        onClick={handlePrev}
        className="absolute left-0 top-1/2 z-20 flex h-[clamp(2.9rem,4.7vw,3.9rem)] w-[clamp(2.9rem,4.7vw,3.9rem)] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/55 bg-black/35 text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-[52%] hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          className="h-[clamp(1.15rem,1.9vw,1.55rem)] w-[clamp(1.15rem,1.9vw,1.55rem)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="visual banner next slide"
        onClick={handleNext}
        className="absolute right-0 top-1/2 z-20 flex h-[clamp(2.9rem,4.7vw,3.9rem)] w-[clamp(2.9rem,4.7vw,3.9rem)] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/55 bg-black/35 text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-[52%] hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          className="h-[clamp(1.15rem,1.9vw,1.55rem)] w-[clamp(1.15rem,1.9vw,1.55rem)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7.5 4.5L13 10l-5.5 5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="bg-white/18 absolute bottom-3 left-1/2 z-20 inline-flex w-fit -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-2xl border border-white/35 px-3 py-2 text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] backdrop-blur-xl backdrop-saturate-150 sm:bottom-4 sm:gap-2.5 sm:px-3.5 sm:py-2.5">
        <button
          type="button"
          aria-label={isPlaying ? 'visual banner autoplay pause' : 'visual banner autoplay play'}
          onClick={handleTogglePlay}
          className="flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-full border border-white/45 bg-black/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {isPlaying ? <BsPauseFill className="text-base" /> : <BsPlayFill className="text-base" />}
        </button>

        <span className="pointer-events-none text-sm font-semibold tracking-[0.08em] text-white/95 sm:text-[15px]">
          {currentSlideText}/{totalSlideText}
        </span>
      </div>
    </Swiper>
  )
}
