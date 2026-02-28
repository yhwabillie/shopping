'use client'
import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import Image from 'next/image'
import { PagingBtn } from '@/lib/components/common/PagingBtn'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'

const bannerList = [
  {
    id: 1,
    title: '요가 루틴 <br /> 밸런스 케어',
    description: '호흡에 집중하는 홈 트레이닝 <br /> 요가복·매트·소도구 기획전',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-1.webp`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-1.webp`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-01.avif`,
    banner_alt: '요가하는 사람의 모습 배너 이미지',
  },
  {
    id: 2,
    title: '블루비치 <br/> 캠핑 체어 무드',
    description: '푸른 바다와 모래사장 앞에서 즐기는 <br/> 감성 캠핑·피크닉 컬렉션',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-2.webp`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-2.webp`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-2.avif`,
    banner_alt: '관광지 바다 관경 배너 이미지',
  },
  {
    id: 3,
    title: '아티장 베이커리 <br/> 바게트 셀렉션',
    description: '겉은 바삭하고 속은 촉촉한 <br/> 프리미엄 브레드 라인업.',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-3.webp`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-3.webp`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/intro-banner-3.avif`,
    banner_alt: '방울 토마토가 여러개 열려있는 모습 배너 이미지',
  },
  {
    id: 4,
    title: '파인 다이닝 <br/> 씨푸드 오마카세',
    description: '정교하게 플레이팅된 조개 스시로 <br/> 완성한 프리미엄 미식 경험',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-4.webp`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-4.webp`,
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
  const [viewportWidth, setViewportWidth] = useState(1280)
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const swiperRef = useRef<SwiperType | null>(null)

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex)
  }

  const handlePrev = () => {
    swiperRef.current?.slidePrev()
  }

  const handleNext = () => {
    const swiper = swiperRef.current
    if (!swiper) return

    if (swiper.isEnd) {
      swiper.slideTo(0, 900, true)
      if (swiper.autoplay && isPlaying) {
        setTimeout(() => {
          swiper.autoplay?.start()
        }, 920)
      }
      return
    }

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
        setViewportWidth(window.innerWidth)
        setIsResizing(false)

        const swiper = swiperRef.current
        if (swiper) {
          swiper.update()
        }
      }, 300)
    }

    setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current)
      }
    }
  }, [])

  const activeBgColor = BANNER_BG_COLOR
  const activeTextColor = getContrastTextColor(activeBgColor)

  const getResponsiveImageSrc = (banner: (typeof bannerList)[number]) => {
    if (viewportWidth < 768) return banner.mobile_image
    if (viewportWidth < 1280) return banner.tablet_image
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

  return (
    <div
      className="aspect-[9/14] w-full transition-colors duration-500 sm:aspect-[4/5] md:aspect-[3/2] xl:aspect-[120/41]"
      style={{ backgroundColor: activeBgColor }}
    >
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
        className={isResizing ? 'h-full [&_.swiper-wrapper]:!transition-none' : 'h-full'}
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        parallax={false}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        spaceBetween={0}
        slidesPerView={1}
        loop={false}
        speed={900}
        allowTouchMove={!isResizing}
        updateOnWindowResize={false}
        onSlideChange={handleSlideChange}
      >
        {bannerList.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            {(() => {
              const isActiveSlide = activeIndex === index

              return (
                <>
                  <div
                    className="container relative mx-auto flex h-full items-center overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24"
                    style={{ backgroundColor: activeBgColor }}
                  >
                    <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: activeBgColor }} />
                    <div
                      className={`z-1 relative mx-auto flex max-w-[90%] flex-col items-center text-center transition-all duration-700 sm:max-w-[74%] md:mx-0 md:max-w-[64%] md:items-start md:text-left lg:max-w-[58%] ${isActiveSlide ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-80'}`}
                    >
                      <h3
                        className={`text-shadow-2xs relative text-[clamp(1.25rem,3.8vw,3.25rem)] font-semibold leading-[1.35] transition-all duration-700 ${isActiveSlide ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                        style={{
                          color: activeTextColor,
                        }}
                        dangerouslySetInnerHTML={{ __html: banner.title }}
                      />
                      <p
                        className={`text-shadow-2xs mt-[clamp(0.35rem,0.85vw,0.75rem)] text-[clamp(0.78rem,1.55vw,1.15rem)] leading-[1.6] transition-all delay-100 duration-700 ${isActiveSlide ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'}`}
                        style={{
                          color: withAlpha(activeTextColor, 0.92),
                        }}
                        dangerouslySetInnerHTML={{ __html: banner.description }}
                      />
                      <button
                        type="button"
                        className={`group mt-[clamp(0.8rem,1.9vw,1.45rem)] inline-flex min-h-[2.4rem] cursor-pointer items-center gap-2 rounded-full bg-white/90 px-[clamp(1.1rem,2.2vw,1.65rem)] py-[clamp(0.45rem,0.95vw,0.72rem)] text-[clamp(0.82rem,1.18vw,1.05rem)] font-semibold text-gray-900 shadow-md transition-all delay-150 duration-500 hover:-translate-y-0.5 hover:bg-white hover:shadow-xl ${isActiveSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
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
                    src={getResponsiveImageSrc(banner)}
                    alt={banner.banner_alt}
                    width={1920}
                    height={1080}
                    className="absolute left-0 top-0 h-full w-full object-cover"
                    quality={100}
                    sizes="100vw"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                  />
                </>
              )
            })()}
          </SwiperSlide>
        ))}

        <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-black/35 px-2.5 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-md sm:bottom-5 sm:gap-2.5 sm:px-3.5 sm:py-2">
          <div className="pointer-events-auto">
            <PagingBtn direction="back" clickEvent={handlePrev} />
          </div>
          <button
            type="button"
            aria-label={isPlaying ? 'swiper pause button' : 'swiper play button'}
            onClick={handleTogglePlay}
            className="pointer-events-auto flex h-9 min-w-9 items-center justify-center rounded-full border border-white/45 bg-white/80 px-2 text-gray-900 shadow-[0_4px_14px_rgba(15,23,42,0.18)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:h-10 sm:min-w-10"
          >
            {isPlaying ? <BsPauseFill className="text-base sm:text-lg" /> : <BsPlayFill className="text-base sm:text-lg" />}
          </button>
          <div className="pointer-events-auto">
            <PagingBtn direction="forward" clickEvent={handleNext} />
          </div>

          <div className="ml-1 flex items-center gap-1.5 sm:ml-2 sm:gap-2">
            {bannerList.map((banner, index) => {
              const isActive = activeIndex === index

              return (
                <span
                  key={`banner-pagination-dot-${banner.id}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? 'w-4 bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.18)] sm:w-5' : 'w-1.5 bg-white/55'}`}
                  aria-hidden
                />
              )
            })}

            <span className="pointer-events-none min-w-10 text-center text-[11px] font-semibold tracking-wide text-white/95 sm:min-w-12 sm:text-xs">
              {activeIndex + 1}/{bannerList.length}
            </span>
          </div>
        </div>
      </Swiper>
    </div>
  )
}
