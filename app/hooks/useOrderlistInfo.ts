import { useOrderlistStore } from '@/lib/stores/orderlistStore'
import { useEffect, useState } from 'react'

export const useOrderlistInfo = (userIdx: string) => {
  const [isMountLoading, setIsMountLoading] = useState(true)
  const { fetchOrderList, data, setUserIdx, setOrderIdx, totalPriceWithShippingCost, showModal, loading, removeOrder, isOrderListEmpty, totalPrice } =
    useOrderlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchOrderList().finally(() => setIsMountLoading(false))
  }, [])

  return {
    data,
    setOrderIdx,
    totalPriceWithShippingCost,
    showModal,
    loading: loading || isMountLoading,
    removeOrder,
    isOrderListEmpty,
    totalPrice,
  }
}
