'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useProductsStore } from '@/lib/stores/productsStore'
import { ProductType } from '@/app/actions/products/actions'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { calculateDiscountedPrice } from '@/lib/utils'
import clsx from 'clsx'
import { LuHeartOff } from 'react-icons/lu'
import { FaHeartCirclePlus } from 'react-icons/fa6'
import { TbShoppingBagMinus, TbShoppingBagPlus } from 'react-icons/tb'
import Image from 'next/image'
import { SkeletonProduct } from './SkeletonProduct'

const SearchProductItem = ({
  product,
  index,
  handleImageLoad,
  handleClickAddWish,
  handleClickAddProduct,
  loadedImages,
}: {
  product: ProductType
  index: number
  handleImageLoad: (idx: string) => void
  handleClickAddWish: (p: ProductType) => void
  handleClickAddProduct: (p: ProductType) => void
}) => {
  const [imageSrc, setImageSrc] = useState(product.imageUrl?.trim() ? product.imageUrl : '/images/no-image.svg')

  useEffect(() => {
    setImageSrc(product.imageUrl?.trim() ? product.imageUrl : '/images/no-image.svg')
  }, [product.imageUrl])

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="hidden"
      animate="visible"
      transition={{
        delay: index * 0.08,
        ease: 'easeInOut',
        duration: 0.2,
      }}
      className="group rounded-xl bg-white p-3 drop-shadow-sm transition-all md:translate-y-0 md:hover:translate-y-[-10px]"
    >
      <figure className="mb-3 aspect-square w-full overflow-hidden rounded-xl border shadow-md bg-gray-200">
        <Image
          src={imageSrc}
          alt={product.name}
          width={400}
          height={600}
          priority={index < 6}
          loading={index < 6 ? 'eager' : 'lazy'}
          onLoad={() => handleImageLoad(product.idx)}
          onError={() => {
            if (imageSrc !== '/images/no-image.svg') {
              setImageSrc('/images/no-image.svg')
            }
            handleImageLoad(product.idx)
          }}
          className="object-cover transition-all duration-500 group-hover:scale-110 h-full w-full"
        />
      </figure>

      <p className="text-sm font-semibold tracking-tight text-gray-700 md:text-[16px]">{product.name}</p>

      <div className="mb-3">
        {product.discount_rate > 0 && (
          <span className="mr-1 inline-block text-[16px] font-bold tracking-tight text-gray-700 md:text-lg">
            {calculateDiscountedPrice(product.original_price, product.discount_rate)}
          </span>
        )}

        {product.discount_rate > 0 && (
          <span className="mr-1 inline-block text-[16px] font-bold tracking-tight text-primary md:text-lg">{`${
            product.discount_rate * 100
          }%`}</span>
        )}
        <span
          className={clsx('text-[16px] font-bold tracking-tight text-gray-700 md:text-lg', {
            'text-sm font-normal !text-gray-400 line-through': product.discount_rate > 0,
          })}
        >{`${product.original_price.toLocaleString('ko-KR')}원`}</span>
      </div>

      <div className="md:flex md:justify-end">
        <button
          type="button"
          onClick={() => handleClickAddWish(product)}
          className={clsx(
            'mr-2 inline-block cursor-pointer rounded-md p-2 text-sm text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
            {
              'bg-secondary hover:bg-pink-500': !product.isInWish,
              'bg-gray-600 hover:bg-rose-700': product.isInWish,
            },
          )}
        >
          {product.isInWish ? <LuHeartOff className="text-2xl" /> : <FaHeartCirclePlus className="text-2xl drop-shadow-md" />}
        </button>
        <button
          type="button"
          onClick={() => handleClickAddProduct(product)}
          className={clsx(
            'inline-block cursor-pointer rounded-md p-2 text-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
            {
              'bg-primary hover:bg-blue-700': !product.isInCart,
              'bg-gray-600 hover:bg-slate-700': product.isInCart,
            },
          )}
        >
          {product.isInCart ? <TbShoppingBagMinus className="text-2xl" /> : <TbShoppingBagPlus className="text-2xl drop-shadow-md" />}
        </button>
      </div>
    </motion.li>
  )
}

export const SearchResult = () => {
  const searchParams = useSearchParams()
  const { status, update } = useSession()
  const query = searchParams.get('query') || ''
  const allData = useProductsStore((state) => state.allData)
  const setSearchQuery = useProductsStore((state) => state.setSearchQuery)
  const fetchAllData = useProductsStore((state) => state.fetchAllData)
  const toggleCartStatus = useProductsStore((state) => state.toggleCartStatus)
  const toggleWishStatus = useProductsStore((state) => state.toggleWishStatus)
  const setSessionUpdate = useProductsStore((state) => state.setSessionUpdate)

  const [isMountLoading, setIsMountLoading] = useState(true)
  const [localLoadedImages, setLocalLoadedImages] = useState<Record<string, boolean>>({})

  const results = allData.filter(
    (product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase()),
  )

  const handleImageLoad = (idx: string) => {
    setLocalLoadedImages((prev) => {
      if (prev[idx]) return prev
      return { ...prev, [idx]: true }
    })
  }

  //1. 세션확인
  useEffect(() => {
    if (status === 'authenticated') {
      setSessionUpdate(update)
    }
  }, [setSessionUpdate, status])

  useEffect(() => {
    fetchAllData().finally(() => setIsMountLoading(false))
    setSearchQuery(query)
  }, [query, setSearchQuery, fetchAllData])

  //위시토글
  const handleClickAddWish = (targetItem: ProductType) => {
    if (status === 'authenticated') {
      //회원 접근
      toggleWishStatus(targetItem.idx)
    } else {
      //비회원 접근
      alert('비회원')
    }
  }

  const handleClickAddProduct = (targetItem: ProductType) => {
    if (status === 'authenticated') {
      //회원 접근
      toggleCartStatus(targetItem.idx)
    } else {
      //비회원 접근
      alert('비회원')
    }
  }

  const isDataLoaded = !isMountLoading

  const waitCount = Math.min(results.length, 6)
  let isInitialImagesLoaded = true
  for (let i = 0; i < waitCount; i++) {
    const product = results[i]
    if (!localLoadedImages[product.idx]) {
      isInitialImagesLoaded = false
      break
    }
  }

  const isImageLoadingPhase = isDataLoaded && results.length > 0 && !isInitialImagesLoaded
  const isLoading = !isDataLoaded || isImageLoadingPhase

  return (
    <section>
      <header className="mx-4 my-4 rounded-lg bg-white p-4 shadow-md sm:container sm:mx-auto">
        <h3 className="mb-1 block w-fit text-lg font-semibold tracking-tighter">🔎 검색 결과</h3>
        <p>
          <span className="text-[16px] font-bold tracking-tighter text-primary">"{query}"</span>
          <span className="tracking-tighter text-gray-700"> 에 대한 검색 결과</span>
        </p>
      </header>

      <div className="relative min-h-[400px]">
        {isLoading && (
          <div
            className={clsx('z-10 w-full bg-slate-50 md:bg-[#f6f7f9]', {
              'absolute inset-0': isImageLoadingPhase,
              'static block': !isImageLoadingPhase,
            })}
          >
            <ul className="mx-4 mb-4 grid grid-cols-2 gap-x-2 gap-y-4 sm:container sm:mx-auto sm:grid-cols-3 md:mx-auto md:gap-x-2 lg:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: Math.max(6, results.length) }).map((_, index) => (
                <SkeletonProduct key={`skeleton-${index}`} />
              ))}
            </ul>
          </div>
        )}

        {isDataLoaded && results.length > 0 && (
          <ul
            className={clsx(
              'mx-4 mb-4 grid grid-cols-2 gap-x-2 gap-y-4 transition-opacity duration-300 sm:container sm:mx-auto sm:grid-cols-3 md:mx-auto md:gap-x-2 lg:grid-cols-4 xl:grid-cols-6',
              {
                'opacity-0 pointer-events-none': isImageLoadingPhase,
                'opacity-100': !isImageLoadingPhase,
              },
            )}
          >
            {results.map((product, index) => (
              <SearchProductItem
                key={`${product.idx}-${index}`}
                product={product}
                index={index}
                handleImageLoad={handleImageLoad}
                handleClickAddWish={handleClickAddWish}
                handleClickAddProduct={handleClickAddProduct}
              />
            ))}
          </ul>
        )}

        {isDataLoaded && results.length === 0 && (
          <div className="mx-4 rounded-lg bg-white p-4 text-center text-[16px] font-normal leading-[200px] tracking-tighter text-gray-600 shadow-md md:container md:mx-auto">
            🕵️‍♂️ 검색 결과가 없습니다.
          </div>
        )}
      </div>
    </section>
  )
}
