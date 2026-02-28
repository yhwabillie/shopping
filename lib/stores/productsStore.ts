import { create } from 'zustand'
import { toast } from 'sonner'
import { fetchAllProducts, fetchProducts, ProductType, toggleProductToCart, toggleWishStatus } from '@/app/actions/products/actions'
import { debounce } from '../debounce'

interface ProductsStore {
  //data idx
  userIdx: string
  setUserIdx: (userIdx: string) => void

  //session update
  sessionUpdate: ((data: any) => void) | null
  setSessionUpdate: (updateMethod: (data: any) => void) => void

  //autoComplete
  searchQuery: string
  autoCompleteSuggestions: ProductType[]
  setAutoCompleteSuggestions: (suggestions: ProductType[]) => void
  setSearchQuery: (query: string) => void
  fetchAutoCompleteSuggestions: (query: string) => void
  selectSearchResult: (selectedProduct: ProductType) => void

  //loaded images
  loadedImages: Record<number, boolean>
  setLoadedImages: (images: Record<number, boolean>) => void
  resetLoadedImages: () => void

  //category
  data: ProductType[]
  filteredData: ProductType[]
  searchResult: ProductType[]
  isEmpty: boolean
  category: string[]
  selectedCategory: string
  totalProducts: number
  currentPage: number
  hasMore: boolean
  loading: boolean
  currentRequestId: number
  setCategoryFilter: (category: string) => void
  fetchData: (page: number, pageSize: number) => Promise<void>
  allData: ProductType[]
  fetchAllData: () => Promise<
    | {
        allProducts: {
          isInCart: boolean
          isInWish: boolean
          category: string
          idx: string
          name: string
          original_price: number
          discount_rate: number
          imageUrl: string
        }[]
        totalProducts: number
      }
    | undefined
  >
  loadMoreData: (page: number, pageSize: number) => Promise<void>
  resetStore: () => void

  //toggle
  toggleWishStatus: (productIdx: string) => void
  toggleCartStatus: (productIdx: string) => void

  syncFilteredDataWithData: () => void

  cartlistLength: number
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  //data idx
  userIdx: '',
  setUserIdx: (userIdx: string) => set({ userIdx }),

  //session update
  sessionUpdate: null,
  setSessionUpdate: (updateMethod) => set({ sessionUpdate: updateMethod }),

  //auto complete
  searchQuery: '',
  autoCompleteSuggestions: [],
  setAutoCompleteSuggestions: (suggestions) => set({ autoCompleteSuggestions: suggestions }),
  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
    get().fetchAutoCompleteSuggestions(query) // 자동완성 결과 가져오기
  },

  allData: [],
  fetchAllData: async () => {
    set({ loading: true })

    try {
      //products -> DB에서 위시리스트와 장바구니를 뒤져서 현재 데이터에 같은 값이 있으면 isInwish, isInCart boolean 값으로 표시한 데이터
      const response = await fetchAllProducts()

      if (!response) {
        console.log('no data')
        return
      }

      set({
        allData: response.allProducts,
      })

      return { allProducts: response.allProducts, totalProducts: response.totalProducts }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('상품 데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      set({ loading: false })
    }
  },

  // 카테고리와 이름을 기준으로 자동완성 결과 가져오기
  fetchAutoCompleteSuggestions: debounce(async (query: string) => {
    if (!query.trim()) {
      set({ autoCompleteSuggestions: [] })
      return
    }

    const { fetchAllData } = get()
    set({ loading: true })

    const allData = await fetchAllData()

    if (!allData) {
      console.log('no data')
      return
    }

    try {
      // 이름과 카테고리로 검색어 필터링
      const suggestions = allData.allProducts.filter(
        (product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase()),
      )

      set({ autoCompleteSuggestions: suggestions })
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      toast.error('자동완성 데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      set({ loading: false })
    }
  }, 300),

  selectSearchResult: (selectedProduct: ProductType) => {
    const { data, setCategoryFilter } = get()

    // 선택된 제품만 필터링
    const filteredData = data.filter((product) => product.idx === selectedProduct.idx)

    // 검색 결과를 고정시키고 다른 로직이 실행되지 않도록 설정
    set({
      searchResult: filteredData,
    })
  },

  loadedImages: {},
  setLoadedImages: (images) =>
    set((state) => ({
      loadedImages: { ...state.loadedImages, ...images },
    })),
  resetLoadedImages: () =>
    set({
      loadedImages: {},
    }),

  //category
  data: [],
  filteredData: [],
  searchResult: [],
  isEmpty: false,
  category: [],
  selectedCategory: '전체',
  totalProducts: 0,
  currentPage: 1,
  hasMore: true,
  loading: false,
  currentRequestId: 0,

  cartlistLength: 0,

  // 카테고리 필터링
  setCategoryFilter: async (category: string) => {
    const { fetchData } = get()
    set({ selectedCategory: category, currentPage: 1, hasMore: true, isEmpty: false })
    await fetchData(1, 8)
  },
  fetchData: async (page: number, pageSize: number): Promise<void> => {
    const requestId = get().currentRequestId + 1
    set({ loading: true, currentRequestId: requestId })

    const category = get().selectedCategory

    try {
      //products -> DB에서 위시리스트와 장바구니를 뒤져서 현재 데이터에 같은 값이 있으면 isInwish, isInCart boolean 값으로 표시한 데이터
      const { products, totalProducts } = await fetchProducts({ page, pageSize, category })

      if (get().currentRequestId !== requestId) return

      set({
        data: products, //전체 데이터
        filteredData: products,
        category: Array.from(new Set(products.map((product) => product.category))),
        totalProducts,
        isEmpty: products.length === 0,
        currentPage: page,
        hasMore: products.length >= pageSize,
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('상품 데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      set({ loading: false })
    }
  },

  // 무한 스크롤을 위한 데이터 로드
  loadMoreData: async (page: number, pageSize: number) => {
    const { selectedCategory, data, currentRequestId } = get()

    set({ loading: true })

    try {
      const { products } = await fetchProducts({ page, pageSize, category: selectedCategory })

      if (get().currentRequestId !== currentRequestId) return

      // 중복 제거 로직 추가
      const mergedData = [...data, ...products.filter((newProduct) => !data.some((existingProduct) => existingProduct.idx === newProduct.idx))]

      set({
        data: mergedData,
        filteredData: mergedData,
        currentPage: page,
        hasMore: products.length >= pageSize,
        isEmpty: products.length === 0,
      })
    } catch (error) {
      console.error('Error fetching more products:', error)
      toast.error('추가 데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      set({ loading: false })
    }
  },

  // 스토어 초기화 (필요에 따라 사용)
  resetStore: () =>
    set({
      data: [],
      filteredData: [],
      category: [],
      selectedCategory: '전체',
      currentPage: 1,
      hasMore: true,
      loading: false,
    }),

  //toggle wish, cart
  toggleWishStatus: async (productIdx: string) => {
    set({ loading: true })

    try {
      const response = await toggleWishStatus(productIdx)
      if (!response?.success) throw new Error('Failed to update wish status')

      // 상태를 업데이트
      const updatedData = get().data.map((item) => (item.idx === productIdx ? { ...item, isInWish: !item.isInWish } : item))
      const updatedFilteredData = get().filteredData.map((item) => (item.idx === productIdx ? { ...item, isInWish: !item.isInWish } : item))
      const updatedSearchData = get().allData.map((item) => (item.idx === productIdx ? { ...item, isInWish: !item.isInWish } : item))

      set({ data: updatedData, filteredData: updatedFilteredData, allData: updatedSearchData })

      toast.success(response.toggleStatus ? '위시리스트에 추가했습니다.' : '위시리스트에서 제거했습니다.')
    } catch (error: unknown) {
      //에러 메시지 처리
      if (error instanceof Error) {
        console.error('Error toggling wishlist status:', error.message)
        toast.error('위시리스트 업데이트에 실패했습니다. 다시 시도해주세요.')
      } else {
        console.error('Unexpected error:', error)
        toast.error('예기치 않은 오류가 발생했습니다.')
      }
    } finally {
      set({ loading: false })
    }
  },

  toggleCartStatus: async (productIdx: string) => {
    const { sessionUpdate } = get()
    set({ loading: true })

    try {
      const response = await toggleProductToCart(productIdx)
      if (!response?.success) throw new Error('Failed to update cart status')

      if (sessionUpdate) {
        sessionUpdate({ cartlist_length: response.cartlistCount })
      }

      const updatedData = get().data.map((item) => (item.idx === productIdx ? { ...item, isInCart: !item.isInCart } : item))
      const updatedFilteredData = get().filteredData.map((item) => (item.idx === productIdx ? { ...item, isInCart: !item.isInCart } : item))
      const updatedSearchData = get().allData.map((item) => (item.idx === productIdx ? { ...item, isInCart: !item.isInCart } : item))

      // console.log('update', updatedData)
      // console.log('ufilter', updatedFilteredData)

      set({ data: updatedData, filteredData: updatedFilteredData, allData: updatedSearchData })

      toast.success(response.toggleStatus ? '장바구니에 추가했습니다.' : '장바구니에서 제거했습니다.')
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error toggling cart status:', error.message)
        toast.error('장바구니 업데이트에 실패했습니다. 다시 시도해주세요.')
      } else {
        console.error('Unexpected error:', error)
        toast.error('예기치 않은 오류가 발생했습니다.')
      }
    } finally {
      set({ loading: false })
    }
  },

  syncFilteredDataWithData: () => {
    const { data, filteredData } = get()

    const syncedData = data.map((item) => {
      const matchingFilteredItem = filteredData.find((filteredItem) => filteredItem.idx === item.idx)
      return matchingFilteredItem ? { ...item, ...matchingFilteredItem } : item
    })

    set({ data: syncedData })
  },
}))
