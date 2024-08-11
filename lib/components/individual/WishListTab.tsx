'use client'
import { addToCartlist, fetchCartList, removeFromCartlist } from '@/app/actions/cartlist/actions'
import { fetchWishlist, removeFromWishlist, addToWishlist } from '@/app/actions/wishlist/actions'
import { FaTrashCan } from 'react-icons/fa6'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { EmptyTab } from './EmptyTab'
import { TabContentSkeleton } from './TabContentSkeleton'
import { FaShoppingBasket, FaShoppingCart } from 'react-icons/fa'
import { MdOutlineAddShoppingCart } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa'
import { TbShoppingBagMinus, TbShoppingBagPlus } from 'react-icons/tb'

export const WishListTab = () => {
  const { data: session, update } = useSession()
  const [data, setData] = useState<any>([])
  const [cartlist, setCartlist] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const userIdx = session?.user?.idx

  const fetchData = async () => {
    try {
      const wishlist = await fetchWishlist()
      setData(wishlist)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 클릭한 상품을 위시리스트에 제거
   */
  const deleteFromWishList = async (productIdx: string) => {
    try {
      const response = await removeFromWishlist(userIdx!, productIdx)
      setData((prev: any) => prev.filter(({ product }: any) => product.idx !== productIdx))
    } catch (error) {
      console.error('Failed to delete wishlist:', error)
      toast.error('wishlist 제거에 실패했습니다, 다시 시도해주세요.')
    }
  }

  /**
   * wishlist DB 데이터 GET
   */
  const fetchCartData = async () => {
    try {
      const response = await fetchCartList(userIdx!)
      setCartlist(response.map(({ product }) => product.idx))
    } catch (error) {
      console.error('Failed to fetch cartlist:', error)
      toast.error('cartlist 데이터 fetch에 실패했습니다, 다시 시도해주세요.')
    }
  }

  /**
   * productIdx를 비교하여 쇼핑카트에 있는 상품인지 체크
   */
  const isProductInCartlist = (productIdx: string) => {
    return cartlist.includes(productIdx)
  }

  /**
   * toggle 클릭한 상품을 쇼핑카트에 추가/제거
   */
  const toggleCartlist = async (productIdx: string) => {
    if (isProductInCartlist(productIdx)) {
      try {
        const response = await removeFromCartlist(userIdx!, productIdx)
        update({ cartlist_length: response })
        setCartlist((prev: any) => prev.filter((idx: any) => idx !== productIdx))
      } catch (error) {}
    } else {
      try {
        const response = await addToCartlist(userIdx!, productIdx)

        update({ cartlist_length: response })
        setCartlist((prev: any) => [...prev, productIdx])
      } catch (error) {}
    }
  }

  useEffect(() => {
    fetchData()
    fetchCartData()
  }, [userIdx])

  const isEmpty = data.length === 0

  if (loading) return <TabContentSkeleton />

  console.log(data)

  return (
    <>
      {isEmpty ? (
        <EmptyTab sub_title="위시리스트가 비었습니다" title="🤩 사고싶은 제품을 추가해주세요." type="link" label="위시리스트 채우러가기" />
      ) : (
        <>
          <h5 className="mb-2 block text-xl font-semibold text-black">위시리스트 상품</h5>
          <ul>
            {data.map(({ product }: any, index: number) => (
              <li key={index} className="mb-5 flex flex-row justify-between rounded-lg border border-gray-300 bg-gray-100 p-3 last:mb-0">
                <div className="flex flex-row">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="mr-5 block h-28 w-28 rounded-lg border border-gray-400/30 drop-shadow-lg"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="mb-1 block w-fit rounded-md bg-blue-600 px-2 py-1 text-sm text-white drop-shadow-md">{product.category}</p>
                    <strong className="text-md block font-medium text-gray-600">{product.name}</strong>

                    {product.discount_rate === 0 ? (
                      <p className="text-lg font-bold text-gray-800">{product.original_price.toLocaleString('ko-KR')}원</p>
                    ) : (
                      <div className="justify-content flex flex-col">
                        <p className="text-xs text-gray-500 line-through">{product.original_price.toLocaleString('ko-KR')}원</p>
                        <p className="text-lg font-bold text-gray-800">
                          {(product.original_price - product.original_price * product.discount_rate).toLocaleString('ko-KR')}원
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <button
                    onClick={() => deleteFromWishList(product.idx)}
                    className="flex items-center gap-2 rounded-lg bg-gray-400/50 px-10 py-3 text-sm font-semibold drop-shadow-lg transition-all duration-150 ease-in-out hover:bg-gray-400 hover:text-white"
                  >
                    <FaTrashCan />
                    <span>위시 삭제</span>
                  </button>

                  <button
                    onClick={() => toggleCartlist(product.idx)}
                    className={clsx(
                      'flex items-center gap-2 rounded-lg px-10 py-3 text-sm font-semibold drop-shadow-lg transition-all duration-150 ease-in-out ',
                      {
                        'bg-gray-400/50 hover:bg-gray-400 hover:text-white': !isProductInCartlist(product.idx),
                        'bg-pink-400 hover:bg-pink-500 hover:text-white': isProductInCartlist(product.idx),
                      },
                    )}
                  >
                    {isProductInCartlist(product.idx) ? <TbShoppingBagPlus className="text-xl" /> : <TbShoppingBagMinus className="text-xl" />}
                    <span>장바구니</span>
                  </button>

                  {/* <button
                    onClick={() => toggleCartlist(product.idx)}
                    className={clsx('wishlist-button  p-3', {
                      'bg-pink-600': isProductInCartlist(product.idx),
                      'bg-pink-600/50': !isProductInCartlist(product.idx),
                    })}
                  >
                    <span>장바구니</span>
                  </button> */}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
