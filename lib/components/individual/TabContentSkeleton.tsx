'use client'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const TabContentSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* Title skeleton */}
      <div className="mb-1">
        <Skeleton width={140} height={28} />
      </div>

      {/* Item skeletons */}
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex flex-col justify-between gap-2 rounded-lg border border-gray-300 bg-gray-100 p-3 md:flex-row">
          <div className="w-full">
            <div className="flex flex-row items-start gap-2.5 md:gap-4 lg:mb-0">
              <div className="relative block h-[100px] w-[100px] shrink-0 overflow-hidden rounded-lg">
                <Skeleton height="100%" />
              </div>

              <div className="w-[calc(100%-(100px+1rem))]">
                <div className="mt-2 flex flex-col justify-center">
                  <div className="mb-1">
                    <Skeleton width={60} height={24} className="rounded-md" />
                  </div>
                  <Skeleton width="80%" height={24} />
                </div>
                <div className="mt-4">
                  <Skeleton width={120} height={28} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 flex w-full flex-row justify-between md:mt-0 md:w-fit md:flex-col md:justify-center md:gap-2">
            <div className="w-[calc(50%-4px)] md:w-[200px]">
              <Skeleton height={40} className="rounded-lg" />
            </div>
            <div className="w-[calc(50%-4px)] md:w-[200px]">
              <Skeleton height={40} className="rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
