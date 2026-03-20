'use client'
import DaumPostcodeEmbed from 'react-daum-postcode'
import { Button } from '@/lib/components/common/modules/Button'
import { useAddressStore } from '@/lib/stores/addressStore'

export const PostCodeModal = () => {
  const { updatePostcode, hideModal } = useAddressStore()

  const handleComplete = (data: any) => {
    updatePostcode(data)
    hideModal('postcode')
  }

  return (
    <div className="fixed left-0 top-0 z-[100] flex h-full w-[calc(100%-15px)] justify-center overflow-y-auto overflow-x-hidden bg-black/70 backdrop-blur-sm py-6 md:py-10">
      <section className="box-border flex h-full w-[340px] flex-col justify-between rounded-2xl bg-white p-4 shadow-lg md:w-[600px] md:p-10">
        <h2 className="mb-4 block text-center text-lg font-semibold tracking-tighter md:text-2xl">주소 검색</h2>
        <div className="mb-4 h-full w-full flex-grow">
          <DaumPostcodeEmbed style={{ height: '100%' }} onComplete={handleComplete} autoClose={false} />
        </div>

        <Button label="닫기" clickEvent={() => hideModal('postcode')} />
      </section>
    </div>
  )
}
