import { fetchOrderlist, OrderlistType, removeOrder } from '@/app/actions/order/actions'
import { toast } from 'sonner'
import { create } from 'zustand'

interface OrderlistStore {
  //userIdx
  userIdx: string
  setUserIdx: (userIdx: string) => void

  loading: boolean
  setLoading: (loading: boolean) => void
  isEmpty: boolean

  //총 제품금액
  totalPrice: (orderIdx: string) => number

  //배송비 조건
  isShippingCost: boolean
  setIsShippingCost: (orderIdx: string) => boolean

  //총 결제금액 (배송비 포함 최종)
  totalPriceWithShippingCost: () => number

  //fetch data control
  fetchData: () => Promise<void>
  data: OrderlistType[]

  //delete Order
  handleRemoveOrderData: (addressIdx: string) => Promise<void>
}

export const useOrderlistStore = create<OrderlistStore>((set, get) => ({
  //userIdx
  userIdx: '',
  setUserIdx: (userIdx: string) => set({ userIdx }),

  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  isEmpty: false,

  //총 제품금액
  totalPrice: (orderIdx: string) => {
    const { data } = get()

    const targetOrderData = data.find((item) => item.idx === orderIdx)

    if (!targetOrderData) {
      toast.error('해당 주문 데이터를 찾을 수 없습니다.')
      return 0
    }

    return targetOrderData.orderItems.reduce((total, { unit_price, quantity }) => total + unit_price * quantity, 0)
  },

  isShippingCost: false,
  setIsShippingCost: (orderIdx: string) => {
    const { totalPrice } = get()

    if (totalPrice(orderIdx) >= 30000) {
      return true
    } else {
      return false
    }
  },

  //총 결제금액 (배송비 포함 최종)
  totalPriceWithShippingCost: () => {
    return 1
  },

  fetchData: async (): Promise<void> => {
    const { userIdx, setLoading } = get()

    setLoading(true)

    try {
      const fetchedOrderlist = await fetchOrderlist(userIdx)
      set({
        data: fetchedOrderlist,
        isEmpty: fetchedOrderlist.length === 0,
      })
    } catch (error) {
      console.error('주문 내역을 가져오는 중 오류가 발생했습니다:', error)
      toast.error('주문 내역을 가져오는 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  },

  data: [],

  handleRemoveOrderData: async (addressIdx: string) => {
    const { setLoading, fetchData } = get()
    setLoading(true)
    try {
      const response = await removeOrder(addressIdx)

      if (!response.success) {
        console.error('주문 삭제에 실패했습니다: ', response)
        toast.error('주문을 삭제하는 데 실패했습니다. 다시 시도해주세요.')
        return // 성공하지 않은 경우, 여기서 처리를 중단합니다.
      }

      await fetchData()
      toast.success('주문이 성공적으로 삭제되었습니다.')
    } catch (error) {
      console.error('주문 삭제 중 오류가 발생했습니다: ', error)
      toast.error('주문을 삭제하는 도중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  },
}))
