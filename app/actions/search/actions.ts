'use server'
import prisma from '@/lib/prisma'
import { Product } from '../upload-product/actions'
import { ProductType } from '../products/actions'

interface SearchProductsParams {
  query: string
  page: number
  pageSize: number
}

export const searchProducts = async ({ query, page, pageSize }: SearchProductsParams): Promise<{ products: Product[]; totalProducts: number }> => {
  const skip = (page - 1) * pageSize
  const take = pageSize

  const [products, totalProducts] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        OR: [{ name: { contains: query, mode: 'insensitive' } }, { category: { contains: query, mode: 'insensitive' } }],
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({
      where: {
        OR: [{ name: { contains: query, mode: 'insensitive' } }, { category: { contains: query, mode: 'insensitive' } }],
      },
    }),
  ])

  return { products, totalProducts }
}

export const fetchAutoCompleteProducts = async (query: string, limit: number = 10): Promise<ProductType[]> => {
  const normalizedQuery = query.trim()

  if (!normalizedQuery) {
    return []
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [{ name: { contains: normalizedQuery, mode: 'insensitive' } }, { category: { contains: normalizedQuery, mode: 'insensitive' } }],
    },
    take: limit,
    orderBy: [{ createdAt: 'desc' }, { idx: 'asc' }],
    select: {
      idx: true,
      name: true,
      category: true,
      original_price: true,
      discount_rate: true,
      imageUrl: true,
    },
  })

  return products.map((item) => ({
    ...item,
    isInCart: false,
    isInWish: false,
  }))
}
