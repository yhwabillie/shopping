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
      <li className="mx-auto w-fit">
        <button onClick={() => onClick(name)}>
          <p
            className={clsx('mx-auto mb-1 flex h-[42px] w-[42px] items-center justify-center rounded-lg border-transparent bg-gray-200/70', {
              'bg-primary/15': isSelected,
            })}
          >
            <Icon
              className={clsx(iconClassName, {
                'text-primary': isSelected,
              })}
            />
          </p>
          <p
            className={clsx('text-center text-xs tracking-tighter text-accent md:text-sm', {
              'font-medium text-primary': isSelected,
            })}
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
      <ul className="mx-auto box-border grid grid-cols-6 gap-3 px-8 pt-5 md:w-fit md:grid-cols-8 md:rounded-lg md:bg-white md:p-5 lg:grid-cols-10 xl:grid-cols-12">
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
