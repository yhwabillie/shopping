import { useWishlistStore } from '@/lib/stores/wishlistStore'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useWishlistInfo = (userIdx: string) => {
  const [isMountLoading, setIsMountLoading] = useState(true)
  const { update } = useSession()
  const { setUserIdx, fetchWishlist, data, isEmpty, loading, toggleCartStatus, deleteWishItem, setSessionUpdate } = useWishlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    setSessionUpdate(update)
    fetchWishlist().finally(() => setIsMountLoading(false))
  }, [userIdx])

  return {
    data,
    isEmpty,
    loading: loading || isMountLoading,
    toggleCartStatus,
    deleteWishItem,
  }
}
