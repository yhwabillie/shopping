'use server'
import prisma from '@/lib/prisma'

export interface Product {
  idx: string
  name: string
  category: string
  original_price: number
  discount_rate: number
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductInput {
  name: string
  category: string
  original_price: number
  discount_rate: number
  imageUrl: string
}

export interface UpdateProduct {
  idx: string
  name: string
  original_price: number
  discount_rate: number
  imageUrl: string
}

type AdminSortField = 'category' | 'original_price' | 'discount_rate' | 'sale_price' | null
type AdminSortOrder = 'asc' | 'desc'

/** admin 상품 데이터 업로드
 * - 상품 데이터 fetch
 * @param {number} page - 페이지 번호
 * @param {number} limit - 페이지당 항목 수
 * @param {string | null} category - 필터링할 카테고리 (선택 사항)
 * @returns {Promise<{ products: Product[], totalProducts: number }>}
 * */
export const fetchProducts = async (
  page: number,
  limit: number,
  category: string | null,
  sortField: AdminSortField = null,
  sortOrder: AdminSortOrder = 'asc',
): Promise<{ products: Product[]; totalProducts: number }> => {
  try {
    const skip = (page - 1) * limit
    const where = category ? { category } : {}

    if (sortField === 'sale_price') {
      const allProducts = await prisma.product.findMany({
        where,
      })

      const sortedProducts = allProducts.sort((a, b) => {
        const salePriceA = a.original_price - a.original_price * (a.discount_rate ?? 0)
        const salePriceB = b.original_price - b.original_price * (b.discount_rate ?? 0)
        return sortOrder === 'asc' ? salePriceA - salePriceB : salePriceB - salePriceA
      })

      return {
        products: sortedProducts.slice(skip, skip + limit),
        totalProducts: sortedProducts.length,
      }
    }

    const orderBy = (() => {
      if (sortField === 'category') {
        return [{ category: sortOrder }, { createdAt: 'desc' as const }, { idx: 'desc' as const }]
      }

      if (sortField === 'original_price') {
        return [{ original_price: sortOrder }, { createdAt: 'desc' as const }, { idx: 'desc' as const }]
      }

      if (sortField === 'discount_rate') {
        return [{ discount_rate: sortOrder }, { createdAt: 'desc' as const }, { idx: 'desc' as const }]
      }

      return [{ createdAt: 'desc' as const }, { idx: 'desc' as const }]
    })()

    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy,
      }),
      prisma.product.count({
        where,
      }),
    ])

    return { products, totalProducts }
  } catch (error: any) {
    throw new Error(error)
  }
}

/** admin 상품 데이터 업로드
 * - 상품 카테고리 데이터 fetch
 */
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const categories = await prisma.product.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    })

    return categories.map((item) => item.category)
  } catch (error: any) {
    throw new Error(error)
  }
}

/** admin 상품 데이터 업로드
 * - 상품 데이터 CREATE
 * */
export const createProduct = async (data: Product) => {
  try {
    const products = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        original_price: data.original_price,
        discount_rate: data.discount_rate,
        imageUrl: data.imageUrl,
      },
    })

    return products
  } catch (error) {
    console.log(error)
  }
}

/** admin 상품 데이터 업로드
 * - 상품 데이터 UPDATE
 * @param {UpdateProductParams} params - 업데이트할 상품의 정보를 포함한 객체
 *   @property {string} idx - 상품의 고유 식별자
 *   @property {string} name - 상품의 이름
 *   @property {number} original_price - 상품의 원래 가격
 *   @property {number} discount_rate - 상품의 할인율
 *   @property {string} imageUrl - 상품의 이미지 URL
 *
 * @returns {Promise<Product>} - 업데이트된 상품 정보를 반환
 * */
export const updateProduct = async ({ idx, name, original_price, discount_rate, imageUrl }: UpdateProduct): Promise<Product> => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { idx },
      data: { name, original_price, discount_rate, imageUrl },
    })
    return updatedProduct
  } catch (error: any) {
    throw new Error(error)
  }
}

export const deleteSelectedProductsByIdx = async (products: any) => {
  try {
    const productIds = Object.keys(products).filter((key) => products[key])

    if (!productIds.length) {
      return { success: true, deletedCount: 0 }
    }

    const [, , deletedProducts] = await prisma.$transaction([
      prisma.cartList.deleteMany({
        where: {
          productIdx: {
            in: productIds,
          },
        },
      }),
      prisma.wishlist.deleteMany({
        where: {
          productIdx: {
            in: productIds,
          },
        },
      }),
      prisma.product.deleteMany({
        where: {
          idx: {
            in: productIds,
          },
        },
      }),
    ])

    return { success: true, deletedCount: deletedProducts.count }
  } catch (error) {
    console.error('Failed to delete selected products:', error)
    throw new Error('Failed to delete selected products')
  }
}

export const deleteAllProducts = async (category: string | null) => {
  try {
    const where = category ? { category } : undefined

    const targetProducts = await prisma.product.findMany({
      where,
      select: { idx: true },
    })

    const productIds = targetProducts.map((item) => item.idx)

    if (!productIds.length) {
      return { success: true, deletedCount: 0 }
    }

    const [, , deletedProducts] = await prisma.$transaction([
      prisma.cartList.deleteMany({
        where: {
          productIdx: {
            in: productIds,
          },
        },
      }),
      prisma.wishlist.deleteMany({
        where: {
          productIdx: {
            in: productIds,
          },
        },
      }),
      prisma.product.deleteMany({
        where: {
          idx: {
            in: productIds,
          },
        },
      }),
    ])

    return { success: true, deletedCount: deletedProducts.count }
  } catch (error) {
    console.error('Failed to delete all products:', error)
    throw new Error('Failed to delete all products')
  }
}

export const createBulkProduct = async (products: CreateProductInput[]) => {
  try {
    if (!products?.length) return { count: 0 }

    const BATCH_SIZE = 1000
    let insertedCount = 0

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE)

      const { count } = await prisma.product.createMany({
        data: batch.map((product) => ({
          name: product.name,
          category: product.category,
          original_price: product.original_price,
          discount_rate: product.discount_rate,
          imageUrl: product.imageUrl,
        })),
      })

      insertedCount += count
    }

    return { count: insertedCount }
  } catch (error) {
    console.error('Failed to create bulk products:', error)
    throw new Error('Failed to create bulk products')
  }
}
