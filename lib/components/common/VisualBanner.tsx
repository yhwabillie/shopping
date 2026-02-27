'use client'
import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, EffectFade, Parallax } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/parallax'
import 'swiper/css/effect-fade'
import Image from 'next/image'
import { PagingBtn } from '@/lib/components/common/PagingBtn'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'

const bannerList = [
  {
    id: 1,
    title: '스포츠 / 레저 <br /> 클리어런스',
    description: '인기 요가복 최대 70% 할인! <br /> 한정수량 빠르게 겟하세요.',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-1.webp`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-1.webp`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-1.webp`,
    banner_alt: '요가하는 사람의 모습 배너 이미지',
  },
  {
    id: 2,
    title: '추석 맞이 <br/> 가족 나들이 특가',
    description: '가족과 함께하는 황금연휴! <br/> 여행 패키지 반값 세일!',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-2.webp`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-2.webp`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-2.webp`,
    banner_alt: '관광지 바다 관경 배너 이미지',
  },
  {
    id: 3,
    title: '연휴 여행 <br/> 준비 끝!',
    description: '추석 연휴, 놓치면 후회할 <br/> 여행 특가상품 모음전!',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-3.webp`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-3.webp`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-3.webp`,
    banner_alt: '방울 토마토가 여러개 열려있는 모습 배너 이미지',
  },
  {
    id: 4,
    title: '추석 선물 대전',
    description: '가족, 친구, 소중한 이들을 위한 <br/> 특별한 추석 선물 추천!',
    mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-4.webp`,
    tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-4.webp`,
    desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-4.webp`,
    banner_alt: '애플 스토어 로고 배너 이미지',
  },
]

const FALLBACK_COLOR = '#6b7280'

const getDominantColorFromImageElement = (img: HTMLImageElement) => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) return FALLBACK_COLOR

    const sampleSize = 24
    canvas.width = sampleSize
    canvas.height = sampleSize
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize)

    const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize)
    let r = 0
    let g = 0
    let b = 0
    let count = 0

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]
      if (alpha < 32) continue
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      count += 1
    }

    if (!count) return FALLBACK_COLOR

    const rr = Math.round(r / count)
    const gg = Math.round(g / count)
    const bb = Math.round(b / count)
    return `rgb(${rr}, ${gg}, ${bb})`
  } catch {
    return FALLBACK_COLOR
  }
}

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
  const [slideBgColorMap, setSlideBgColorMap] = useState<Record<number, string>>({})
  const [slideReadyMap, setSlideReadyMap] = useState<Record<number, boolean>>({})
  const [colorExtractedMap, setColorExtractedMap] = useState<Record<number, boolean>>({})
  const [isPlaying, setIsPlaying] = useState(true)
  const [isResizing, setIsResizing] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(1280)
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const loadedImageMapRef = useRef<Record<number, HTMLImageElement>>({})
  const swiperRef = useRef<SwiperType | null>(null)

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex)
  }

  const handlePrev = () => {
    swiperRef.current?.slidePrev()
  }

  const handleNext = () => {
    swiperRef.current?.slideNext()
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

  const handleMoveToIndex = (index: number) => {
    swiperRef.current?.slideToLoop(index)
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

  const activeBgColor = slideBgColorMap[activeIndex] ?? FALLBACK_COLOR
  const activeTextColor = getContrastTextColor(activeBgColor)
  const getContainerWidth = (vw: number) => {
    if (vw < 640) return vw
    if (vw < 768) return 640
    if (vw < 1024) return 768
    if (vw < 1280) return 1024
    if (vw < 1536) return 1280
    return 1536
  }

  const sideGap = Math.max((viewportWidth - getContainerWidth(viewportWidth)) / 2, 0)
  const showSideBlend = sideGap > 2

  const getResponsiveImageSrc = (banner: (typeof bannerList)[number]) => {
    if (viewportWidth < 768) return banner.mobile_image
    if (viewportWidth < 1280) return banner.tablet_image
    return banner.desktop_image
  }

  const applyColorForSlide = (index: number) => {
    const imgEl = loadedImageMapRef.current[index]
    if (!imgEl || colorExtractedMap[index]) return

    const dominantColor = getDominantColorFromImageElement(imgEl)
    setSlideBgColorMap((prev) => (prev[index] === dominantColor ? prev : { ...prev, [index]: dominantColor }))
    setColorExtractedMap((prev) => (prev[index] ? prev : { ...prev, [index]: true }))
    setSlideReadyMap((prev) => (prev[index] ? prev : { ...prev, [index]: true }))
  }

  const handleImageReady = (index: number, imgEl: HTMLImageElement) => {
    loadedImageMapRef.current[index] = imgEl

    // 초기 로드시에는 1번(인덱스 0)만 즉시 색상 추출
    if (index === 0) {
      applyColorForSlide(index)
    }
  }

  useEffect(() => {
    // 슬라이드 전환 시, 해당 슬라이드 이미지가 로드되어 있으면 그때 색상 추출 시작
    applyColorForSlide(activeIndex)
  }, [activeIndex, colorExtractedMap])

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper?.autoplay) return

    if (isResizing) {
      swiper.autoplay.stop()
      return
    }

    if (isPlaying) {
      swiper.autoplay.start()
      return
    }

    // 사용자가 정지한 상태에서는 리사이즈 후에도 강제로 정지 유지
    swiper.autoplay.stop()
  }, [isResizing, isPlaying])

  return (
    <div
      className="aspect-[9/14] w-full transition-colors duration-500 sm:aspect-[4/5] md:aspect-[3/2] xl:aspect-[120/41]"
      style={{ backgroundColor: activeBgColor }}
    >
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        className={isResizing ? 'h-full [&_.swiper-wrapper]:!transition-none [&_[data-swiper-parallax]]:!transition-none' : 'h-full'}
        modules={[Parallax, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        parallax
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={0}
        slidesPerView={1}
        loop
        speed={900}
        allowTouchMove={!isResizing}
        updateOnWindowResize={false}
        onSlideChange={handleSlideChange}
      >
        {bannerList.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <div
              className="container relative mx-auto flex h-full items-center overflow-hidden px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24"
              style={{ backgroundColor: activeBgColor }}
            >
              <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: activeBgColor }} />
              <div className="z-1 relative max-w-[82%] sm:max-w-[72%] md:max-w-[64%] lg:max-w-[58%]">
                <h3
                  className="relative text-2xl font-semibold leading-[1.35] sm:text-3xl md:text-4xl lg:text-5xl"
                  data-swiper-parallax="-600"
                  style={{
                    color: activeTextColor,
                    textShadow: activeTextColor === '#ffffff' ? '0 1px 10px rgba(0,0,0,0.45)' : '0 1px 10px rgba(255,255,255,0.35)',
                  }}
                  dangerouslySetInnerHTML={{ __html: banner.title }}
                />
                <p
                  className="mt-2 text-sm leading-relaxed sm:text-base md:text-lg"
                  data-swiper-parallax="-420"
                  style={{
                    color: withAlpha(activeTextColor, 0.92),
                    textShadow: activeTextColor === '#ffffff' ? '0 1px 8px rgba(0,0,0,0.35)' : '0 1px 8px rgba(255,255,255,0.28)',
                  }}
                  dangerouslySetInnerHTML={{ __html: banner.description }}
                />
                <button
                  type="button"
                  data-swiper-parallax="-260"
                  className="mt-4 inline-flex cursor-pointer items-center rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-gray-900 shadow-md transition hover:bg-white sm:mt-5 sm:px-5 sm:py-2 sm:text-sm"
                >
                  자세히 보기
                </button>
              </div>
              <Image
                src={getResponsiveImageSrc(banner)}
                alt={banner.banner_alt}
                width={1920}
                height={1080}
                className={`absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-150 ${slideReadyMap[index] ? 'opacity-100' : 'opacity-0'}`}
                data-swiper-parallax="-180"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                onLoad={(event) => {
                  handleImageReady(index, event.currentTarget as HTMLImageElement)
                }}
              />
              <div
                aria-hidden
                className={`pointer-events-none absolute left-0 top-0 h-full w-8 transition-colors duration-500 ${showSideBlend ? 'block' : 'hidden'}`}
                style={{
                  backgroundColor: activeBgColor,
                  WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
                  maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
                }}
              ></div>
              <div
                aria-hidden
                className={`pointer-events-none absolute right-0 top-0 h-full w-8 transition-colors duration-500 ${showSideBlend ? 'block' : 'hidden'}`}
                style={{
                  backgroundColor: activeBgColor,
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
                }}
              ></div>
            </div>
          </SwiperSlide>
        ))}

        <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur-sm sm:bottom-5 sm:gap-2.5 sm:px-3">
          <div className="pointer-events-auto">
            <PagingBtn direction="back" clickEvent={handlePrev} />
          </div>
          <button
            type="button"
            aria-label={isPlaying ? 'swiper pause button' : 'swiper play button'}
            onClick={handleTogglePlay}
            className="pointer-events-auto flex h-10 min-w-10 items-center justify-center rounded-full bg-white/90 px-2 text-gray-900 shadow-sm sm:h-12 sm:min-w-12"
          >
            {isPlaying ? <BsPauseFill className="text-base sm:text-lg" /> : <BsPlayFill className="text-base sm:text-lg" />}
          </button>
          <div className="pointer-events-auto">
            <PagingBtn direction="forward" clickEvent={handleNext} />
          </div>

          <span className="pointer-events-none ml-1 min-w-10 text-center text-xs font-semibold text-white sm:ml-2 sm:min-w-12 sm:text-sm">
            {activeIndex + 1}/{bannerList.length}
          </span>
        </div>
      </Swiper>
    </div>
  )
}
