import { useEffect, useState } from 'react'
import { useAddressStore } from '@/lib/stores/addressStore'

export const useAddressInfo = (userIdx: string) => {
  const [isMountLoading, setIsMountLoading] = useState(true)
  const {
    fetchAddresses,
    defaultAddress,
    EtcAddress,
    openEditAddressForm,
    updateDefaultAddress,
    showModal,
    deleteAddress,
    setUserIdx,
    loading,
    isEmpty,
  } = useAddressStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchAddresses().finally(() => setIsMountLoading(false))
  }, [userIdx, setUserIdx, fetchAddresses])

  return {
    defaultAddress,
    EtcAddress,
    openEditAddressForm,
    updateDefaultAddress,
    showModal,
    deleteAddress,
    loading: loading || isMountLoading,
    isEmpty,
  }
}
