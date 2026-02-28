'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
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

export const SearchResult = () => {
  const searchParams = useSearchParams()
  const { status, update } = useSession()
  const query = searchParams.get('query') || ''
  const {
    allData,
    setSearchQuery,
    fetchAllData,
    toggleCartStatus,
    loadedImages,
    resetLoadedImages,
    setLoadedImages,
    toggleWishStatus,
    setSessionUpdate,
  } = useProductsStore()

  const results = allData.filter(
    (product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase()),
  )

  const handleImageLoad = (index: number) => {
    setLoadedImages({ [index]: true }) // Zustand의 상태 업데이트
  }

  //1. 세션확인
  useEffect(() => {
    if (status === 'authenticated') {
      setSessionUpdate(update)
    }
  }, [setSessionUpdate, status])

  useEffect(() => {
    fetchAllData()
    setSearchQuery(query)

    resetLoadedImages()

    const initialLoadedImages: Record<number, boolean> = {}
    results.forEach((_, index) => {
      initialLoadedImages[index] = false
    })
    setLoadedImages(initialLoadedImages)
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

  return (
    <section>
      <header className="mx-4 my-4 rounded-lg bg-white p-4 shadow-md sm:container sm:mx-auto">
        <h3 className="mb-1 block w-fit text-lg font-semibold tracking-tighter">🔎 검색 결과</h3>
        <p>
          <span className="text-[16px] font-bold tracking-tighter text-primary">"{query}"</span>
          <span className="tracking-tighter text-gray-700"> 에 대한 검색 결과</span>
        </p>
      </header>

      {results.length > 0 ? (
        <ul className="mx-4 mb-4 grid grid-cols-2 gap-x-2 gap-y-4 sm:container sm:mx-auto sm:grid-cols-3 md:mx-auto md:gap-x-2 lg:grid-cols-4 xl:grid-cols-6">
          {results.map((product, index) => (
            <motion.li
              key={`${product.idx}-${index}`}
              variants={{
                hidden: {
                  opacity: 0,
                },
                visible: {
                  opacity: 1,
                },
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
              <figure className="mb-3 aspect-square w-full overflow-hidden rounded-xl border bg-gray-600 shadow-md">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={600}
                  priority={index === 0}
                  onLoad={() => handleImageLoad(index)}
                  className="object-cover transition-all duration-300 group-hover:scale-110"
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
                  <span className="mr-1 inline-block text-[16px] font-bold tracking-tight text-primary md:text-lg">{`${product.discount_rate * 100}%`}</span>
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
                  className="mr-2 inline-block rounded-md bg-secondary p-2 text-sm text-white shadow-md transition-all duration-300"
                >
                  {product.isInWish ? <LuHeartOff className="text-2xl" /> : <FaHeartCirclePlus className="text-2xl drop-shadow-md" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleClickAddProduct(product)}
                  className={clsx('inline-block rounded-md p-2 text-sm text-white duration-300', {
                    'hover:bg-primary-tonDown bg-primary': !product.isInCart,
                    'bg-gray-600 hover:bg-gray-700': product.isInCart,
                  })}
                >
                  {product.isInCart ? <TbShoppingBagMinus className="text-2xl" /> : <TbShoppingBagPlus className="text-2xl drop-shadow-md" />}
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="mx-4 rounded-lg bg-white p-4 text-center text-[16px] font-normal leading-[200px] tracking-tighter text-gray-600 shadow-md md:container md:mx-auto">
          🕵️‍♂️ 검색 결과가 없습니다.
        </div>
      )}
    </section>
  )
}
