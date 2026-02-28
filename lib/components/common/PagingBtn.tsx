import { IoIosArrowBack } from 'react-icons/io'
import { IoIosArrowForward } from 'react-icons/io'

interface PagingBtnProps {
  direction: 'back' | 'forward'
  clickEvent: () => void
}

export const PagingBtn = ({ direction, clickEvent }: PagingBtnProps) => {
  return (
    <button
      aria-label={`swiper banner ${direction} button`}
      onClick={clickEvent}
      className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/45 bg-white/80 text-gray-900 shadow-[0_4px_14px_rgba(15,23,42,0.18)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:h-10 sm:w-10"
    >
      {direction === 'back' && <IoIosArrowBack className="text-lg transition-transform duration-150 group-hover:-translate-x-0.5 sm:text-xl" />}
      {direction === 'forward' && <IoIosArrowForward className="text-lg transition-transform duration-150 group-hover:translate-x-0.5 sm:text-xl" />}
    </button>
  )
}
