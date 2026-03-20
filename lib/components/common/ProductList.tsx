'use client'
import { useProductsStore } from '@/lib/stores/productsStore'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Category } from './Category'
import { LoadingSpinner } from './modules/LoadingSpinner'
import { useInView } from 'react-intersection-observer'
import { useSession } from 'next-auth/react'
import { ProductType } from '@/app/actions/products/actions'
import { SkeletonProduct } from './SkeletonProduct'
import { toast } from 'sonner'
import { ProductItem } from './ProductItem'
import clsx from 'clsx'

export const ProductList = () => {
  const { status, update } = useSession()
  const filteredData = useProductsStore((state) => state.filteredData)
  const selectedCategory = useProductsStore((state) => state.selectedCategory)
  const listLoading = useProductsStore((state) => state.listLoading)
  const isEmpty = useProductsStore((state) => state.isEmpty)
  const hasMore = useProductsStore((state) => state.hasMore)
  const totalProducts = useProductsStore((state) => state.totalProducts)
  const currentPage = useProductsStore((state) => state.currentPage)

  const setSearchQuery = useProductsStore((state) => state.setSearchQuery)
  const fetchData = useProductsStore((state) => state.fetchData)
  const setCategoryFilter = useProductsStore((state) => state.setCategoryFilter)
  const loadMoreData = useProductsStore((state) => state.loadMoreData)
  const toggleCartStatus = useProductsStore((state) => state.toggleCartStatus)
  const toggleWishStatus = useProductsStore((state) => state.toggleWishStatus)
  const setSessionUpdate = useProductsStore((state) => state.setSessionUpdate)
  const resetStore = useProductsStore((state) => state.resetStore)
  const loadedImages = useProductsStore((state) => state.loadedImages)
  const setLoadedImages = useProductsStore((state) => state.setLoadedImages)
  const resetLoadedImages = useProductsStore((state) => state.resetLoadedImages)

  const pageSize = 8
  const [columnCount, setColumnCount] = useState(2)
  const [hasInitialFetchCompleted, setHasInitialFetchCompleted] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [shouldRenderSkeletons, setShouldRenderSkeletons] = useState(false)
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(false)

  const isDataLoaded = hasInitialFetchCompleted && !(listLoading && filteredData.length === 0)

  const initialDataCount = Math.min(filteredData.length, pageSize)
  let isInitialImagesLoaded = true
  for (let i = 0; i < initialDataCount; i++) {
    if (!loadedImages[i]) {
      isInitialImagesLoaded = false
      break
    }
  }

  const isImageLoadingPhase = isDataLoaded && filteredData.length > 0 && !isInitialImagesLoaded
  const isInitialRendering = !isDataLoaded || isImageLoadingPhase

  const isLoadingMoreRef = useRef(false)
  const skeletonHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasMorePages = hasMore
  const isAllProductsLoaded = totalProducts > 0 && filteredData.length >= totalProducts

  const { ref: triggerRef, inView: triggerInView } = useInView({
    threshold: 0,
    rootMargin: '0px 0px 240px 0px',
  })

  useEffect(() => {
    const calculateColumnCount = () => {
      if (window.matchMedia('(min-width: 1280px)').matches) {
        setColumnCount(5)
        return
      }

      if (window.matchMedia('(min-width: 768px)').matches) {
        setColumnCount(4)
        return
      }

      if (window.matchMedia('(min-width: 640px)').matches) {
        setColumnCount(3)
        return
      }

      setColumnCount(2)
    }

    calculateColumnCount()
    window.addEventListener('resize', calculateColumnCount)

    return () => {
      window.removeEventListener('resize', calculateColumnCount)
    }
  }, [])

  const skeletonCount = useMemo(() => {
    if (!hasMorePages) return 0

    const remainder = filteredData.length % columnCount
    return remainder === 0 ? columnCount : columnCount - remainder
  }, [hasMorePages, filteredData.length, columnCount])

  useEffect(() => {
    if (!hasMorePages) {
      if (skeletonHideTimerRef.current) {
        clearTimeout(skeletonHideTimerRef.current)
        skeletonHideTimerRef.current = null
      }

      setShouldRenderSkeletons(false)
      setIsSkeletonVisible(false)
      return
    }

    if (skeletonHideTimerRef.current) {
      clearTimeout(skeletonHideTimerRef.current)
      skeletonHideTimerRef.current = null
    }

    if (isLoadingMore) {
      setShouldRenderSkeletons(true)

      const frame = requestAnimationFrame(() => {
        setIsSkeletonVisible(true)
      })

      return () => {
        cancelAnimationFrame(frame)
      }
    }

    setIsSkeletonVisible(false)
    skeletonHideTimerRef.current = setTimeout(() => {
      setShouldRenderSkeletons(false)
    }, 300)

    return () => {
      if (skeletonHideTimerRef.current) {
        clearTimeout(skeletonHideTimerRef.current)
        skeletonHideTimerRef.current = null
      }
    }
  }, [isLoadingMore, hasMorePages])

  // 1. 세션 확인
  useEffect(() => {
    if (status === 'authenticated') {
      setSessionUpdate(update)
    }
  }, [setSessionUpdate, status])

  // 2. 초기 데이터 패치
  const loadInitialData = useCallback(async () => {
    try {
      setSearchQuery('')
      resetLoadedImages()
      await fetchData(1, pageSize)
    } catch (error) {
      toast.error('데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      setHasInitialFetchCompleted(true)
    }
  }, [fetchData, setSearchQuery, resetLoadedImages])

  useEffect(() => {
    loadInitialData()

    return () => {
      resetStore()
    }
  }, [loadInitialData, resetStore])

  // 3. 무한 스크롤 Trigger (중복 호출 방지 + store의 currentPage 기준)
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasInitialFetchCompleted || listLoading || isEmpty || !hasMorePages || isAllProductsLoaded) return

    isLoadingMoreRef.current = true
    setIsLoadingMore(true)
    try {
      await loadMoreData(currentPage + 1, pageSize)
    } catch (error) {
      toast.error('추가 데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoadingMore(false)
      isLoadingMoreRef.current = false
    }
  }, [hasInitialFetchCompleted, listLoading, isEmpty, hasMorePages, isAllProductsLoaded, loadMoreData, currentPage, pageSize])

  useEffect(() => {
    if (triggerInView && hasMorePages && !isAllProductsLoaded) {
      handleLoadMore()
    }
  }, [triggerInView, hasMorePages, isAllProductsLoaded, handleLoadMore])

  // 위시 추가 & 제거 Toggle
  const handleClickAddWish = useCallback(
    (targetItem: ProductType) => {
      if (status === 'authenticated') {
        toggleWishStatus(targetItem.idx)
      } else {
        toast.error('로그인이 필요합니다.')
      }
    },
    [status, toggleWishStatus],
  )

  // 장바구니 추가 & 제거 Toggle
  const handleClickAddProduct = useCallback(
    (targetItem: ProductType) => {
      if (status === 'authenticated') {
        toggleCartStatus(targetItem.idx)
      } else {
        toast.error('로그인이 필요합니다.')
      }
    },
    [status, toggleCartStatus],
  )

  return (
    <div className="relative z-10 mx-auto mt-4 box-border min-w-[calc(360px-20px)] rounded-t-[2rem] bg-white pb-4 pt-4 drop-shadow-2xl md:static md:z-0 md:mt-0 md:w-auto md:bg-transparent">
      {/* 카테고리 필터 */}
      {!isInitialRendering && filteredData.length > 0 && <Category setCategoryFilter={setCategoryFilter} selectedCategory={selectedCategory} />}

      {/* 상품 리스트 */}
      <section className="container relative min-h-[400px] box-border w-full bg-white sm:mx-auto md:mt-4 md:bg-transparent">
        {isInitialRendering && (
          <div
            className={clsx('z-10 w-full', {
              'absolute inset-0 bg-white md:bg-transparent': isImageLoadingPhase,
              'static block': !isImageLoadingPhase,
            })}
          >
            <ul className="mx-4 my-4 box-border grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:m-0 md:grid-cols-4 md:gap-3 xl:grid-cols-5 xl:gap-4">
              {Array.from({ length: Math.max(10, initialDataCount) }).map((_, index) => (
                <SkeletonProduct key={`initial-skeleton-${index}`} />
              ))}
            </ul>
          </div>
        )}

        {isDataLoaded && filteredData.length > 0 && (
          <ul
            className={clsx(
              'mx-4 my-4 box-border grid grid-cols-2 gap-2 transition-opacity duration-500 sm:grid-cols-3 sm:gap-3 md:m-0 md:grid-cols-4 md:gap-3 xl:grid-cols-5 xl:gap-4',
              {
                'opacity-0 pointer-events-none': isImageLoadingPhase,
                'opacity-100': !isImageLoadingPhase,
              }
            )}
          >
            {filteredData.map((product, index) => (
              <ProductItem
                key={product.idx}
                product={product}
                index={index}
                handleClickAddProduct={handleClickAddProduct}
                handleClickAddWish={handleClickAddWish}
                onImageLoad={() => setLoadedImages({ [index]: true })}
              />
            ))}

            {/* Skeleton Products (무한 스크롤 시 추가로 로드될 때 표시) */}
            {hasMorePages &&
              isLoadingMore &&
              shouldRenderSkeletons &&
              Array.from({ length: skeletonCount }, (_, i) => (
                <SkeletonProduct key={`skeleton-${i}`} className={isSkeletonVisible ? 'opacity-100' : 'opacity-0'} />
              ))}
          </ul>
        )}

        {isDataLoaded && filteredData.length === 0 && (
          <div className="mx-4 my-4 flex min-h-[220px] items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm font-medium text-slate-500 md:mx-0">
            상품 데이터가 없습니다.
          </div>
        )}

        {!isInitialRendering && hasMorePages && !isAllProductsLoaded && <div key={filteredData.length} ref={triggerRef} className="h-12 w-full" aria-hidden />}

        {!isInitialRendering && isLoadingMore && (
          <div className="flex h-48 w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </section>
    </div>
  )
}
