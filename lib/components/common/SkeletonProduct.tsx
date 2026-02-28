interface SkeletonProductProps {
  triggerRef?: (node?: Element | null) => void
  className?: string
}

export const SkeletonProduct = ({ triggerRef, className = '' }: SkeletonProductProps) => {
  return (
    <li
      ref={triggerRef}
      className={`relative box-border flex aspect-[2/3] h-full w-full animate-pulse flex-col justify-between overflow-hidden p-5 shadow-md shadow-gray-400 transition-opacity duration-300 ease-out ${className}`}
    >
      {/* 카테고리, 제목 */}
      <div className="space-y-2">
        <div className="relative z-[1] mb-2 h-4 w-1/3 rounded bg-gray-400"></div>
        <div className="relative z-[1] h-6 w-3/4 rounded bg-gray-300"></div>
      </div>

      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="relative z-[1] mb-2 h-8 w-1/2 rounded bg-gray-400"></div>
          <div className="relative z-[1] h-6 w-1/3 rounded bg-gray-300"></div>
        </div>
        <ul className="flex flex-col gap-3">
          <li>
            <div className="relative z-[1] h-10 w-10 rounded-full bg-gray-400"></div>
          </li>
          <li>
            <div className="relative z-[1] h-10 w-10 rounded-full bg-gray-300"></div>
          </li>
        </ul>
      </div>

      {/* 배경 이미지 */}
      <figure className="absolute left-0 top-0 z-0 h-full w-full rounded-lg bg-gray-200"></figure>

      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-500 via-transparent to-gray-400"></div>
    </li>
  )
}
