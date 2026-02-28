'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Session } from 'inspector'
import { getServerSession } from 'next-auth'

interface FetchProductsParams {
  page: number
  pageSize: number
  category?: string
}

export interface ProductType {
  idx: string
  name: string
  category: string
  original_price: number
  discount_rate: number
  imageUrl: string
  isInCart?: boolean
  isInWish?: boolean
}

export const fetchAllProducts = async () => {
  const session = await getServerSession(authOptions)
  const userIdx = session?.user?.idx

  try {
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          idx: true,
          name: true,
          category: true,
          original_price: true,
          discount_rate: true,
          imageUrl: true,
        },
      }),
      prisma.product.count(),
    ])

    // 미리 장바구니와 위시리스트 항목을 가져옴
    const [cartItems, wishItems] = await Promise.all([
      prisma.cartList.findMany({
        where: { userIdx },
        select: { productIdx: true },
      }),
      prisma.wishlist.findMany({
        where: { userIdx },
        select: { productIdx: true },
      }),
    ])

    // Set을 사용하여 빠르게 장바구니와 위시리스트 상태 확인
    const cartItemSet = new Set(cartItems.map((item) => item.productIdx))
    const wishItemSet = new Set(wishItems.map((item) => item.productIdx))

    // 제품 목록에 장바구니 및 위시리스트 상태 추가
    const productsWithCartAndWishStatus = products.map((item) => ({
      ...item,
      isInCart: cartItemSet.has(item.idx),
      isInWish: wishItemSet.has(item.idx),
    }))

    return { allProducts: productsWithCartAndWishStatus, totalProducts }
  } catch (error) {
    console.log(error)
  }
}

/**
 * 제품 목록을 페이지네이션을 고려하여 가져오는 함수.
 *
 * @param {FetchProductsParams} params - 페이지 번호(page)와 페이지 크기(pageSize)를 포함하는 객체.
 * @param {number} params.page - 가져올 페이지의 번호 (1부터 시작).
 * @param {number} params.pageSize - 한 페이지에 표시할 제품의 수.
 *
 * @returns {Promise<{ products: ProductType[]; totalProducts: number }>}
 *  - products: 요청된 페이지에 해당하는 제품 목록 배열.
 *  - totalProducts: 데이터베이스에 저장된 전체 제품 수.
 *
 * @throws {Error}
 */
export const fetchProducts = async ({
  page,
  pageSize,
  category,
}: FetchProductsParams): Promise<{ products: ProductType[]; totalProducts: number }> => {
  const skip = (page - 1) * pageSize
  const take = pageSize
  const session = await getServerSession(authOptions)
  const userIdx = session?.user?.idx
  const categoryFilter = category && category !== '전체' ? category : undefined

  try {
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        where: categoryFilter ? { category: categoryFilter } : undefined,
        orderBy: [
          { createdAt: 'asc' },
          { idx: 'asc' }, // 유니크한 필드를 추가하여 순서를 명확히 지정
        ],
        select: {
          idx: true,
          name: true,
          category: true,
          original_price: true,
          discount_rate: true,
          imageUrl: true,
        },
      }),
      prisma.product.count({ where: categoryFilter ? { category: categoryFilter } : undefined }),
    ])

    // 미리 장바구니와 위시리스트 항목을 가져옴
    const [cartItems, wishItems] = await Promise.all([
      prisma.cartList.findMany({
        where: { userIdx },
        select: { productIdx: true },
      }),
      prisma.wishlist.findMany({
        where: { userIdx },
        select: { productIdx: true },
      }),
    ])

    // Set을 사용하여 빠르게 장바구니와 위시리스트 상태 확인
    const cartItemSet = new Set(cartItems.map((item) => item.productIdx))
    const wishItemSet = new Set(wishItems.map((item) => item.productIdx))

    // 제품 목록에 장바구니 및 위시리스트 상태 추가
    const productsWithCartAndWishStatus = products.map((item) => ({
      ...item,
      isInCart: cartItemSet.has(item.idx),
      isInWish: wishItemSet.has(item.idx),
    }))

    // console.log('화면으로 페이징되어 4개씩 떨어지는 데이터', productsWithCartAndWishStatus)

    return { products: productsWithCartAndWishStatus, totalProducts }
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}

export const toggleWishStatus = async (productIdx: string) => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.idx) return

  const userIdx = session?.user?.idx

  try {
    // 위시리스트에서 제품이 있는지 확인
    const targetProductItem = await prisma.wishlist.findUnique({
      where: {
        userIdx_productIdx: {
          userIdx,
          productIdx,
        },
      },
    })

    let toggleStatus: boolean

    if (targetProductItem) {
      //위시리스트에서 제품을 제거
      await prisma.wishlist.delete({
        where: {
          userIdx_productIdx: {
            userIdx,
            productIdx,
          },
        },
      })
      toggleStatus = false // 위시리스트에서 제거됨
    } else {
      // 위시리스트에 제품을 추가
      await prisma.wishlist.create({
        data: {
          userIdx,
          productIdx,
        },
      })
      toggleStatus = true // 위시리스트에 추가됨
    }

    return {
      success: true,
      toggleStatus,
    }
  } catch (error) {
    console.error(`Failed to toggle product in wishlist for user ${userIdx}:`, error)
    throw new Error('Failed to toggle product in wishlist')
  }
}

export const toggleProductToCart = async (productIdx: string) => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.idx) return

  const userIdx = session?.user?.idx

  try {
    // 장바구니에서 제품이 있는지 확인
    const targetProductItem = await prisma.cartList.findUnique({
      where: {
        userIdx_productIdx: {
          userIdx,
          productIdx,
        },
      },
    })

    let toggleStatus: boolean

    if (targetProductItem) {
      // 장바구니에서 제품을 제거
      await prisma.cartList.delete({
        where: {
          userIdx_productIdx: {
            userIdx,
            productIdx,
          },
        },
      })
      toggleStatus = false // 장바구니에서 제거됨
    } else {
      // 장바구니에 제품을 추가
      await prisma.cartList.create({
        data: {
          userIdx,
          productIdx,
          quantity: 1,
        },
      })
      toggleStatus = true // 장바구니에 추가됨
    }

    // 장바구니의 총 제품 수 계산
    const cartlistCount = await prisma.cartList.count({
      where: {
        userIdx,
      },
    })

    return {
      success: true,
      cartlistCount,
      toggleStatus,
    }
  } catch (error) {
    console.error(`Failed to toggle product in cart for user ${userIdx}:`, error)
    throw new Error('Failed to toggle product in cart')
  }
}
