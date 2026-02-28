import clsx from 'clsx'
import React from 'react'
import { FaChair, FaCheck, FaPaperclip, FaRegGrinStars } from 'react-icons/fa'
import { IoAirplane, IoTicket } from 'react-icons/io5'
import { MdOutlineSmartToy, MdSportsSoccer } from 'react-icons/md'
import { GiClothes } from 'react-icons/gi'
import { HiMiniTv } from 'react-icons/hi2'
import { PiBowlFoodFill } from 'react-icons/pi'
import { TbDog } from 'react-icons/tb'
import { IconType } from 'react-icons'

interface CategoryProps {
  setCategoryFilter: (category: string) => void
  selectedCategory: string
}

const categories = [
  { name: '전체', icon: FaCheck, iconClassName: 'text-2xl text-accent' },
  { name: '문구', icon: FaPaperclip, iconClassName: 'text-2xl' },
  { name: '완구/취미', icon: MdOutlineSmartToy, iconClassName: 'text-3xl text-accent' },
  { name: '여행', icon: IoAirplane, iconClassName: 'text-2xl text-accent' },
  { name: '패션', icon: GiClothes, iconClassName: 'text-3xl text-accent' },
  { name: '티켓', icon: IoTicket, iconClassName: 'text-2xl text-accent' },
  { name: '뷰티', icon: FaRegGrinStars, iconClassName: 'text-accentl text-2xl' },
  { name: '가전/디지털', icon: HiMiniTv, iconClassName: 'text-2xl text-accent' },
  { name: '식품', icon: PiBowlFoodFill, iconClassName: 'text-2xl text-accent' },
  { name: '인테리어', icon: FaChair, iconClassName: 'text-2xl text-accent' },
  { name: '스포츠/레저', icon: MdSportsSoccer, iconClassName: 'text-2xl text-accent' },
  { name: '반려동물', icon: TbDog, iconClassName: 'text-2xl text-accent' },
]

const CategoryItem = React.memo(
  ({
    name,
    icon: Icon,
    iconClassName,
    isSelected,
    onClick,
  }: {
    name: string
    icon: IconType
    iconClassName: string
    isSelected: boolean
    onClick: (name: string) => void
  }) => {
    return (
      <li className="mx-auto w-full max-w-[88px] px-0.5">
        <button
          type="button"
          onClick={() => onClick(name)}
          className="group flex w-full min-w-[68px] cursor-pointer flex-col items-center rounded-lg transition-transform duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <p
            className={clsx(
              'mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border-transparent bg-gray-200/70 transition-all duration-200 group-hover:bg-primary/15 group-hover:shadow-[0_6px_14px_rgba(37,99,235,0.22)]',
              {
                'bg-primary/15': isSelected,
              },
            )}
          >
            <Icon
              className={clsx(iconClassName, 'transition-colors duration-200 group-hover:text-primary', {
                'text-primary': isSelected,
              })}
            />
          </p>
          <p
            className={clsx(
              'whitespace-nowrap text-center text-xs tracking-tighter text-accent transition-colors duration-200 group-hover:text-primary md:text-sm',
              {
                'font-medium text-primary': isSelected,
              },
            )}
          >
            {name}
          </p>
        </button>
      </li>
    )
  },
)

export const Category = React.memo(({ setCategoryFilter, selectedCategory }: CategoryProps) => {
  return (
    <>
      <h3 className="sr-only">상품 카테고리</h3>
      <ul className="mx-auto box-border grid grid-cols-4 gap-x-2 gap-y-3 px-3 pt-4 sm:grid-cols-5 sm:gap-x-3 sm:px-4 md:w-fit md:grid-cols-8 md:gap-x-4 md:rounded-lg md:bg-white md:p-5 lg:grid-cols-10 xl:grid-cols-12">
        {categories.map((category) => (
          <CategoryItem
            key={category.name}
            name={category.name}
            icon={category.icon}
            iconClassName={category.iconClassName}
            isSelected={selectedCategory === category.name}
            onClick={setCategoryFilter}
          />
        ))}
      </ul>
    </>
  )
})
