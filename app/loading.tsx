import { LoadingSpinner } from '@/lib/components/common/modules/LoadingSpinner'

export default function Loading() {
  return (
    <>
      {/* Next.js의 layout-router가 스크롤 포커스를 잡을 수 있도록 static 요소 삽입 (경고 우회) */}
      <span aria-hidden="true" className="block h-0 w-0 opacity-0" />
      <div className="fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center bg-white/80 backdrop-blur-sm">
        <LoadingSpinner />
      </div>
    </>
  )
}
