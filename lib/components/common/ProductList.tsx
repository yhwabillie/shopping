'use client'
import { useProductsStore } from '@/lib/stores/productsStore'
import { useCallback, useEffect, useState } from 'react'
import { Category } from './Category'
import { LoadingSpinner } from './modules/LoadingSpinner'
import { useInView } from 'react-intersection-observer'
import { useSession } from 'next-auth/react'
import { ProductType } from '@/app/actions/products/actions'
import { SkeletonProduct } from './SkeletonProduct'
import { toast } from 'sonner'
import { ProductItem } from './ProductItem'
import { debounce } from '@/lib/debounce'

export const ProductList = () => {
  const { status, update } = useSession()
  const {
    filteredData,
    setSearchQuery,
    selectedCategory,
    fetchData,
    setCategoryFilter,
    loadMoreData,
    loading,
    isEmpty,
    toggleCartStatus,
    toggleWishStatus,
    setSessionUpdate,
    hasMore,
    resetStore,
  } = useProductsStore()

  const [page, setPage] = useState(1)
  const pageSize = 8
  const skeletonCount = 3
  const [hasInitialFetchCompleted, setHasInitialFetchCompleted] = useState(false)
  const isInitialLoading = !hasInitialFetchCompleted || (loading && filteredData.length === 0)

  const hasMorePages = hasMore

  const { ref: triggerRef, inView: triggerInVeiw } = useInView({
    threshold: 0.35,
    rootMargin: '0px 0px -120px 0px',
  })

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
      await fetchData(1, pageSize)
    } catch (error) {
      toast.error('데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      setHasInitialFetchCompleted(true)
    }
  }, [fetchData, setSearchQuery])

  useEffect(() => {
    loadInitialData()

    return () => {
      resetStore()
    }
  }, [loadInitialData, resetStore])

  // 3. 무한 스크롤 Trigger (데이터 중복 로드 방지)
  const [loadingMore, setLoadingMore] = useState(false)

  const handleLoadMore = useCallback(
    debounce(async () => {
      if (!loading && !isEmpty && hasMorePages && !loadingMore) {
        setLoadingMore(true)
        try {
          await loadMoreData(page + 1, pageSize)
          setPage((prevPage) => prevPage + 1)
        } catch (error) {
          toast.error('추가 데이터를 가져오는 중 오류가 발생했습니다.')
        } finally {
          setLoadingMore(false)
        }
      }
    }, 600),
    [loading, isEmpty, hasMorePages, loadingMore, loadMoreData, page, pageSize],
  )

  useEffect(() => {
    if (triggerInVeiw && page >= 1 && !loading) {
      handleLoadMore()
    }
  }, [triggerInVeiw, handleLoadMore, page, loading])

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
      <Category setCategoryFilter={setCategoryFilter} selectedCategory={selectedCategory} />

      {/* 상품 리스트 */}
      <section className="container box-border w-full bg-white sm:mx-auto md:mt-4 md:bg-transparent">
        {isInitialLoading ? (
          <div className="flex h-48 w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <ul className="mx-4 my-4 box-border grid grid-cols-2 sm:grid-cols-3 md:m-0 md:grid-cols-4 xl:grid-cols-5">
            {filteredData.map((product, index) => (
              <ProductItem
                key={product.idx}
                product={product}
                index={index}
                handleClickAddProduct={handleClickAddProduct}
                handleClickAddWish={handleClickAddWish}
              />
            ))}

            {/* Skeleton Products (무한 스크롤 시 추가로 로드될 때 표시) */}
            {hasMorePages &&
              Array.from({ length: skeletonCount }, (_, i) => (
                <SkeletonProduct key={`skeleton-${i}`} triggerRef={i === 0 ? triggerRef : undefined} />
              ))}
          </ul>
        )}

        {!isInitialLoading && hasMorePages && (
          <div className="flex h-48 w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </section>
    </div>
  )
}
