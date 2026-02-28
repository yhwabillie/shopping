'use client'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Button } from '@/lib/components/common/modules/Button'
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCheck, FaFileExcel, FaTrash, FaTrashAlt } from 'react-icons/fa'
import {
  deleteAllProducts,
  deleteSelectedProductsByIdx,
  fetchCategories,
  fetchProducts,
  UpdateProduct,
  updateProduct,
} from '@/app/actions/upload-product/actions'
import { useProductStore } from '@/lib/zustandStore'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/lib/components/common/modules/LoadingSpinner'
import { Product } from '@prisma/client'
import * as XLSX from 'xlsx'
import { ProductItemModal } from '@/lib/components/admin/ProductItemModal'
import { IoMdArrowDropdown } from 'react-icons/io'
import { BtnLoadingSpinner } from '@/lib/components/common/modules/BtnLoadingSpinner'

interface CheckedItem {
  [key: string]: boolean
}

type SortField = 'category' | 'original_price' | 'discount_rate' | 'sale_price' | null
type SortOrder = 'asc' | 'desc'
const PAGE_LIMIT_OPTIONS = [10, 20, 30] as const

const SortToggleIcon = ({ active, order }: { active: boolean; order: SortOrder }) => {
  if (!active) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-slate-400">
        <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 17l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (order === 'asc') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-blue-700">
        <path d="M8 14l4-4 4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-blue-700">
      <path d="M8 10l4 4 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const ProductList = () => {
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteAllLoading, setDeleteAllLoading] = useState(false)
  const [isDeleteSelectedConfirmOpen, setIsDeleteSelectedConfirmOpen] = useState(false)
  const [isDeleteAllConfirmOpen, setIsDeleteAllConfirmOpen] = useState(false)

  const [pageLimit, setPageLimit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalProductsCount, setTotalProductsCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const [data, setData] = useState<Product[]>([])
  const [checkedItems, setCheckedItems] = useState<CheckedItem>({})
  const [isAllChecked, setIsAllChecked] = useState(false)

  const productState = useProductStore((state) => state.productState)
  const setProductState = useProductStore((state) => state.setProductState)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const hasProducts = totalProductsCount > 0
  const canUseCategoryFilter = !loading && hasProducts && categories.length > 0
  const selectedProductsInCurrentPage = data.filter((item) => checkedItems[item.idx])
  const selectedCount = selectedProductsInCurrentPage.length
  const selectedProductTitles = selectedProductsInCurrentPage.map((item) => item.name)

  // 현재 페이지가 바뀔 때 체크박스 상태를 리셋
  useEffect(() => {
    setCheckedItems({})
    setIsAllChecked(false)
  }, [currentPage])

  // 카테고리가 바뀔 때 체크박스 상태를 리셋
  useEffect(() => {
    setCheckedItems({})
    setIsAllChecked(false)
  }, [selectedCategory])

  /**
   * - checkedItems 객체 내의 값들이 모두 true인지 확인하여 모든 아이템이 체크되었는지 확인
   * - 모든 아이템이 체크되었으면 checkAllRef를 업데이트
   * - checkAllRef : 전체 체크 input element ref
   * - checkedItems : DB에 최종 저장되는 결과 state
   */
  const updateCheckAllStatus = () => {
    const totalItems = data?.length ?? 0
    const checkedCountInCurrentPage = data.reduce((count, item) => {
      return count + (checkedItems[item.idx] ? 1 : 0)
    }, 0)

    setIsAllChecked(checkedCountInCurrentPage === totalItems && totalItems > 0)
  }

  /**
   * - 상품 리스트에서 삭제된 항목 제거
   * - 선택된 제품 idx가 같은 데이터를 data 배열에서 삭제
   * @param {Product[]} array - 최초 fetch data 배열
   * @param {Record<string, boolean>} selectedItems - 선택된 제품 idx와 그 상태를 가진 객체
   * @returns {Product[]} - 선택된 제품이 제거된 새로운 데이터 배열
   */
  const removeMatchingProducts = (array: Product[], selectedItems: Record<string, boolean>): Product[] => {
    return array.filter((item) => !selectedItems.hasOwnProperty(item.idx))
  }

  /**
   * 선택된 item을 삭제하고 상태를 업데이트하는 event handler 함수
   */
  const handleDeleteSelected = async () => {
    if (selectedCount === 0) {
      return
    }

    console.log('서버로 저장되는 데이터===>', checkedItems)

    //item이 체크되면 true값을 할당, 값이 true인 것을 필터링
    const selectedItems = Object.keys(checkedItems).reduce((acc: CheckedItem, key: string) => {
      if (checkedItems[key]) {
        acc[key] = checkedItems[key]
      }
      return acc
    }, {})

    console.log('잔여 데이터에서 빼야하는 데이터===>', selectedItems)
    setDeleteLoading(true) // 로딩 시작

    //DB mutate
    try {
      await deleteSelectedProductsByIdx(selectedItems)
      console.log('서버에서 삭제 성공')

      // 상태 초기화 및 업데이트
      setCheckedItems({})

      console.log('잔여 데이터', data)
      setIsAllChecked(false)

      const remainingData = removeMatchingProducts(data, selectedItems)
      console.log('최종 잔여 데이터', remainingData)
      setData(remainingData)

      // 삭제 후에도 페이지를 채울 수 있도록 재조회
      const nextPage = remainingData.length === 0 && currentPage > 1 ? currentPage - 1 : currentPage

      if (nextPage !== currentPage) {
        setCurrentPage(nextPage)
      } else {
        setLoading(true)
        await fetchData(nextPage, selectedCategory)
      }
    } catch (error) {
      console.error('Failed to delete selected products:', error)
      toast.error('선택한 제품을 삭제하는 데 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsDeleteSelectedConfirmOpen(false)
      setDeleteLoading(false) // 로딩 상태 해제
    }
  }

  const handleDeleteAll = async () => {
    try {
      setDeleteAllLoading(true)
      await deleteAllProducts(selectedCategory)

      setCheckedItems({})
      setIsAllChecked(false)

      setLoading(true)
      await fetchData(1, selectedCategory)
      setCurrentPage(1)
    } catch (error) {
      console.error('Failed to delete all products:', error)
      toast.error('전체 삭제에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setDeleteAllLoading(false)
    }
  }

  /**
   * - 개별 체크박스 클릭 시 isChecked 값을 checkItems state에 저장 (toggle)
   * - 신규 isChecked와 기존 isChecked의 값이 같다면 반대 값으로 업데이트 (idx 비교)
   * - 같지 않으면 신규 값으로 업데이트
   * @param {string} key - 체크박스의 제품 키값
   * @param {boolean} isChecked - 체크 여부
   */
  const toggleCheckedItem = (key: string, isChecked: boolean) => {
    setCheckedItems((prev) => {
      const updatedItems = { ...prev }

      // 새로 들어온 값과 기존 값이 같다면 반대로 설정
      if (prev[key] === isChecked) {
        updatedItems[key] = !isChecked
      } else {
        // 새로 들어온 값으로 업데이트
        updatedItems[key] = isChecked
      }

      return updatedItems
    })
  }

  /**
   * - 개별 체크박스 클릭 시 isChecked 값을 checkItems state에 저장 (toggle)
   * - 무조건 할당된 isChecked value를 신규값으로 업데이트
   * @param {string} key - 체크박스의 제품 키값
   * @param {boolean} isChecked - 체크 여부
   */
  const updateCheckedItem = (key: string, isChecked: boolean) => {
    setCheckedItems((prev) => {
      const updatedItems = { ...prev }

      updatedItems[key] = isChecked

      return updatedItems
    })
  }

  /**
   * isChecked 값을 모든 checkedItems 항목에 대해 업데이트
   * @param {boolean} isChecked - 체크 여부
   */
  const updateAllValues = (isChecked: boolean) => {
    if (!isChecked) {
      setCheckedItems({})
      return
    }

    const updatedItems = data.reduce(
      (acc, item) => {
        acc[item.idx] = true
        return acc
      },
      {} as { [key: string]: boolean },
    )

    setCheckedItems(updatedItems)
  }

  const handleSortToggle = (field: Exclude<SortField, null>) => {
    const nextOrder: SortOrder = sortField === field ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc'
    setSortField(field)
    setSortOrder(nextOrder)
    setLoading(true)
    setCurrentPage(1)
  }

  /**
   * products DB 데이터 GET
   * @param {number} page - 현재 페이지
   * @param {string | null} category - 필터링할 카테고리 (선택 사항)
   */
  const fetchData = async (page: number, category: string | null) => {
    try {
      const { products, totalProducts } = await fetchProducts(page, pageLimit, category, sortField, sortOrder)
      setData(products)
      setTotalPages(Math.ceil(totalProducts / pageLimit))
      setTotalProductsCount(totalProducts)
      setCurrentPage(page)
    } catch (error: any) {
      console.error('Failed to fetch products:', error) // 디버그용
      toast.error('데이터 fetch에 실패했습니다, 다시 시도해주세요.') // 사용자 알림용
    } finally {
      setLoading(false)
    }
  }

  /**
   * 현재 페이지 변경
   * @param page - 현재 페이지
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageLimitChange = (limit: number) => {
    if (pageLimit === limit) {
      return
    }

    setPageLimit(limit)
    setCurrentPage(1)
    setCheckedItems({})
    setIsAllChecked(false)
    setLoading(true)
  }

  /**
   * 현재 페이지를 기준으로 앞뒤로 1 페이지 버튼만 표시
   */
  const renderPaginationButtons = () => {
    const pageButtons = []

    // 맨 앞으로 화살표 버튼
    if (currentPage > 1) {
      pageButtons.push(
        <button
          key="first"
          className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 shadow-md"
          onClick={() => handlePageChange(1)}
        >
          <FaAngleDoubleLeft className="text-white" />
        </button>,
      )
    }

    // 이전 화살표 버튼 (1번째 페이지가 아닐 경우 show)
    if (currentPage > 1) {
      pageButtons.push(
        <button
          key="prev"
          className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500 shadow-md"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FaAngleLeft className="text-white" />
        </button>,
      )
    }

    // 이전 페이지 버튼 (1번째 페이지가 아닐 경우 show)
    if (currentPage > 1) {
      pageButtons.push(
        <button
          key={currentPage - 1}
          className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-300"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {currentPage - 1}
        </button>,
      )
    }

    // 현재 페이지 버튼 (항상 show)
    pageButtons.push(
      <button key="current" className="h-10 w-10 rounded-md bg-blue-200 font-semibold text-blue-600" disabled>
        {currentPage}
      </button>,
    )

    // 다음 페이지 버튼 (마지막 페이지가 아닐 경우 show)
    if (currentPage < totalPages) {
      pageButtons.push(
        <button
          key={currentPage + 1}
          className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-300 font-semibold text-gray-500"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </button>,
      )
    }

    // 다음 화살표 버튼 (마지막 페이지가 아닐 경우 show)
    if (currentPage < totalPages) {
      pageButtons.push(
        <button
          key="next"
          className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500 shadow-md"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <FaAngleRight className="text-white" />
        </button>,
      )
    }

    // 맨 뒤로 화살표 버튼
    if (currentPage < totalPages) {
      pageButtons.push(
        <button
          key="last"
          className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 shadow-md"
          onClick={() => handlePageChange(totalPages)}
        >
          <FaAngleDoubleRight className="text-white" />
        </button>,
      )
    }

    return pageButtons
  }

  /**
   * 카테고리 데이터 가져오기
   */
  const fetchCategoryData = async () => {
    try {
      const categories = await fetchCategories()
      setCategories(categories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  /**
   * 선택된 카테고리를 상태로 설정하고, 페이지를 첫 페이지로 리셋
   * @param {ChangeEvent<HTMLSelectElement>} event
   */
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value)
    setCurrentPage(1)
  }

  /**
   * 상품 리스트를 엑셀 파일로 다운로드
   * - 프론트에서 필터된 상태를 반영하여 파일 생성
   * - 다운로드 연월일 시간을 파일 이름에 적용하여 버전 구별
   */
  const handleDownload = () => {
    // 필요한 칼럼을 제외한 새로운 객체 배열 생성
    const filteredProducts = data.map(({ idx, imageUrl, createdAt, updatedAt, ...rest }) => ({
      제품명: rest.name,
      카테고리: rest.category,
      정가: rest.original_price,
      할인율: rest.discount_rate,
    }))

    const worksheet = XLSX.utils.json_to_sheet(filteredProducts)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url

    const date = new Date()
    const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
    const formattedTime = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`
    a.download = `products_${formattedDate}_${formattedTime}${selectedCategory ? `_${selectedCategory}` : ''}.xlsx`

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  /**
   * 선택한 제품 클릭 handler event
   * - 선택한 제품의 상세 정보를 레이어 모달창 show
   * - 제품 정보를 편집할 수 있는 입력 필드와 저장 및 취소 버튼을 포함
   * @param {Product} product - 클릭된 제품 데이터
   */
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  /**
   * 함수는 모달을 닫고, 선택된 제품 정보를 초기화
   */
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  /**
   * 업데이트된 제품 정보를 서버에 저장하고, 성공적으로 저장되면 상태를 업데이트
   */
  const saveProduct = async (updatedProduct: UpdateProduct) => {
    try {
      const savedProduct = await updateProduct(updatedProduct)
      setData((prevProducts) => prevProducts.map((product) => (product.idx === savedProduct.idx ? savedProduct : product)))
      closeModal()
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  useEffect(() => {
    fetchData(currentPage, selectedCategory)
    fetchCategoryData()

    if (productState) {
      setLoading(true)
    }

    if (currentPage) {
      setLoading(true)
    }

    //엑셀 데이터에서 DB 업로드 분기 - 리셋
    setProductState(false)
  }, [productState, currentPage, selectedCategory, sortField, sortOrder, pageLimit])

  useEffect(() => {
    // fetch data와 checkedItems의 개수가 같으면 모두 체크
    updateCheckAllStatus()
  }, [checkedItems, data])

  return (
    <section aria-labelledby="product-list-heading" className="mx-4 lg:mx-0">
      <h4 id="product-list-heading" className="sr-only">
        업로드된 상품 리스트
      </h4>
      <div className="mb-6 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-fit shadow-sm">
          <select
            onChange={handleCategoryChange}
            value={selectedCategory || ''}
            disabled={!canUseCategoryFilter}
            className="w-[200px] rounded-md border border-blue-500/50 px-3 py-2 font-medium text-blue-500 focus:outline-0"
          >
            <option value="">전체</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <IoMdArrowDropdown className="absolute right-[5px] top-[50%] z-10 translate-y-[-50%] text-2xl text-blue-500" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-sm">
            {PAGE_LIMIT_OPTIONS.map((limit) => (
              <button
                key={limit}
                type="button"
                onClick={() => handlePageLimitChange(limit)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors md:text-sm ${
                  pageLimit === limit ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {limit}개 보기
              </button>
            ))}
          </div>

          <p className="w-fit rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            {selectedCategory ? `${selectedCategory}` : '전체'} 총 {totalProductsCount.toLocaleString('ko-KR')}개
          </p>
        </div>
      </div>

      <div className="mb-10 flex flex-row justify-end gap-2 lg:mb-5">
        <div className="w-[230px]">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!hasProducts}
            className="leading-1 flex h-[50px] w-full min-w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-emerald-500 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-400 md:text-[16px]"
          >
            <FaFileExcel className="text-base" />
            <span>전체 Excel 다운로드</span>
          </button>
        </div>
        <div className="w-[150px]">
          <button
            type="button"
            onClick={() => setIsDeleteSelectedConfirmOpen(true)}
            disabled={deleteLoading || deleteAllLoading || selectedCount === 0}
            className="leading-1 flex h-[50px] w-full min-w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-amber-500 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-gray-400 md:text-[16px]"
          >
            {deleteLoading ? (
              <BtnLoadingSpinner />
            ) : (
              <>
                <FaTrash className="text-base" />
                <span>선택 삭제</span>
              </>
            )}
          </button>
        </div>
        <div className="w-[150px]">
          <button
            type="button"
            onClick={() => setIsDeleteAllConfirmOpen(true)}
            disabled={deleteAllLoading || deleteLoading || !hasProducts}
            className="leading-1 flex h-[50px] w-full min-w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-rose-500 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-gray-400 md:text-[16px]"
          >
            {deleteAllLoading ? (
              <BtnLoadingSpinner />
            ) : (
              <>
                <FaTrashAlt className="text-base" />
                <span>전체 삭제</span>
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <table className="mx-0 mt-5 w-full border-collapse">
            <thead className="bg-blue-100">
              <tr className="h-10 border-b border-t border-gray-300">
                <th className="box-border w-[5%]">
                  <label
                    htmlFor="check_all"
                    className="mx-auto flex h-4 w-4 cursor-pointer items-center justify-center border border-gray-500/50 bg-white"
                  >
                    <input
                      id="check_all"
                      type="checkbox"
                      checked={isAllChecked}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const isChecked = event.target.checked

                        if (isChecked) {
                          updateAllValues(true)
                          setIsAllChecked(true)
                        } else {
                          updateAllValues(false)
                          setIsAllChecked(false)
                        }
                      }}
                    />
                    {isAllChecked && <FaCheck className="cursor-pointer text-blue-600" />}
                  </label>
                </th>
                <th className="w-[50%] text-center text-sm">이름</th>
                <th className="w-[10%] text-center text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>카테고리</span>
                    <button
                      type="button"
                      onClick={() => handleSortToggle('category')}
                      className="rounded p-0.5 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                      aria-label="카테고리 정렬 토글"
                    >
                      <SortToggleIcon active={sortField === 'category'} order={sortOrder} />
                    </button>
                  </div>
                </th>
                <th className="w-[10%] text-center text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>정가</span>
                    <button
                      type="button"
                      onClick={() => handleSortToggle('original_price')}
                      className="rounded p-0.5 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                      aria-label="정가 정렬 토글"
                    >
                      <SortToggleIcon active={sortField === 'original_price'} order={sortOrder} />
                    </button>
                  </div>
                </th>
                <th className="w-[10%] text-center text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>할인</span>
                    <button
                      type="button"
                      onClick={() => handleSortToggle('discount_rate')}
                      className="rounded p-0.5 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                      aria-label="할인 정렬 토글"
                    >
                      <SortToggleIcon active={sortField === 'discount_rate'} order={sortOrder} />
                    </button>
                  </div>
                </th>
                <th className="w-[15%] text-center text-sm">
                  <div className="flex items-center justify-center gap-1">
                    <span>판매가</span>
                    <button
                      type="button"
                      onClick={() => handleSortToggle('sale_price')}
                      className="rounded p-0.5 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                      aria-label="판매가 정렬 토글"
                    >
                      <SortToggleIcon active={sortField === 'sale_price'} order={sortOrder} />
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.length > 0 ? (
                data.map((item: Product, index: any) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="w-[5%]">
                      <label htmlFor={item.idx} className="mx-auto flex h-4 w-4 cursor-pointer items-center justify-center border border-gray-500/50">
                        <input
                          checked={!!checkedItems[`${item.idx}`]}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const isChecked = event.target.checked

                            toggleCheckedItem(`${item.idx}`, isChecked)
                          }}
                          type="checkbox"
                          id={item.idx}
                        />
                        {checkedItems[`${item.idx}`] && <FaCheck className="cursor-pointer text-blue-600" />}
                      </label>
                    </td>
                    <td onClick={() => handleProductClick(item)} className="box-border w-[50%] break-all p-2 text-left text-sm">
                      {item.name}
                    </td>
                    <td className="box-border w-[15%] text-center text-sm">{item.category}</td>
                    <td className="box-border w-[10%] text-center text-sm">{item.original_price.toLocaleString('ko-KR')}</td>
                    <td className="box-border w-[10%] text-center text-sm">{`${item.discount_rate! * 100}%`}</td>
                    <td className="box-border w-[10%] pr-2 text-right text-sm">
                      {`${(item.original_price - item.original_price * item.discount_rate!).toLocaleString('ko-KR')}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm font-medium text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {data.length > 0 && <div className="flex flex-row items-center justify-center gap-2 py-10">{renderPaginationButtons()}</div>}
        </>
      )}

      {selectedProduct && <ProductItemModal isOpen={isModalOpen} onClose={closeModal} product={selectedProduct} onSave={saveProduct} />}

      {isDeleteSelectedConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
            <h5 className="text-lg font-semibold text-gray-900">선택 삭제 확인</h5>
            <p className="mt-2 text-sm text-gray-600">선택한 {selectedCount.toLocaleString('ko-KR')}개의 상품을 삭제할까요?</p>

            <div className="mt-3 max-h-40 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3">
              <p className="mb-2 text-xs font-semibold text-gray-500">삭제 대상 상품명</p>
              <ul className="space-y-1">
                {selectedProductTitles.map((title, index) => (
                  <li key={`${title}-${index}`} className="truncate text-sm text-gray-700">
                    • {title}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-2 text-xs text-rose-600">삭제 후 복구할 수 없습니다.</p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteSelectedConfirmOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={deleteLoading}
                className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {deleteLoading ? <BtnLoadingSpinner /> : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteAllConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
            <h5 className="text-lg font-semibold text-gray-900">전체 삭제 확인</h5>
            <p className="mt-2 text-sm text-gray-600">
              {selectedCategory ? `선택된 카테고리(${selectedCategory})의 상품을 모두 삭제할까요?` : '전체 상품 데이터를 모두 삭제할까요?'}
            </p>
            <p className="mt-1 text-xs text-rose-600">삭제 후 복구할 수 없습니다.</p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteAllConfirmOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleDeleteAll()
                  setIsDeleteAllConfirmOpen(false)
                }}
                className="rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
