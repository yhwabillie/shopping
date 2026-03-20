import { CheckedItemType } from '@/lib/stores/cartlistStore'
import { calculateDiscountedPrice } from '@/lib/utils'
import clsx from 'clsx'
import Image from 'next/image'
import { FaCheck, FaMinus, FaPlus } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

interface CartItemProps {
  index: number
  checkedItems: CheckedItemType
  idx: string
  category: string
  name: string
  imageUrl: string
  discount_rate: number
  original_price: number
  quantity: number
  handleChangeCheckbox: () => void
  handleDecrease: () => void
  handleIncrease: () => void
  handleSetQuantity: (value: number) => void
  handleDeleteCartItem: () => void
}

export const CartItem = ({
  index,
  checkedItems,
  idx,
  category,
  name,
  imageUrl,
  discount_rate,
  original_price,
  quantity,
  handleChangeCheckbox,
  handleDecrease,
  handleIncrease,
  handleSetQuantity,
  handleDeleteCartItem,
}: CartItemProps) => {
  return (
    <li
      className={clsx('relative rounded-lg pb-3 pl-3 pr-5 pt-5 last:mb-0 md:pr-10', {
        'border-blue-300 bg-blue-100': checkedItems[idx],
        'border-gray-300 bg-gray-100': !checkedItems[idx],
      })}
    >
      {/* 삭제 버튼 */}
      <button
        type="button"
        onClick={handleDeleteCartItem}
        className="absolute right-2 top-2 flex w-fit items-center rounded-md bg-gray-500 p-1 text-sm font-semibold text-white drop-shadow-lg transition-all duration-150 ease-in-out hover:bg-gray-600"
      >
        <IoMdClose className="text-xl" />
      </button>

      <div className="md:flex md:flex-row md:items-end md:justify-between">
        <div className="mb-4 flex flex-row items-start justify-between md:gap-3">
          <div className="flex flex-row items-start gap-1">
            {/* 체크박스 */}
            <label htmlFor={idx} className="relative h-6 w-6 cursor-pointer rounded-sm bg-gray-400/40 drop-shadow-md md:h-8 md:w-8 md:rounded-md">
              <input id={idx} type="checkbox" checked={checkedItems[idx] || false} onChange={handleChangeCheckbox} />
              {checkedItems[idx] && (
                <FaCheck className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] cursor-pointer text-lg text-blue-600" />
              )}
            </label>

            {/* 이미지 */}
            <div className="relative block h-[80px] w-[80px] overflow-hidden rounded-md border border-gray-400/30 bg-gray-600 drop-shadow-lg md:h-28 md:w-28 md:rounded-lg lg:mt-0">
              <Image
                src={imageUrl}
                alt={name}
                width={80}
                height={120}
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="absolute left-0 top-0 w-full object-fill"
              />
            </div>
          </div>

          {/* 정보 */}
          <div className="flex w-[calc(100%-112px)] flex-col justify-end">
            <p className="mb-1 mt-1 block w-fit rounded-md bg-blue-600 px-2 py-1 text-[10px] text-white drop-shadow-sm md:text-sm">{category}</p>
            <strong className="block text-sm font-medium tracking-tighter text-gray-600 md:text-[16px]">{name}</strong>
          </div>
        </div>

        <div className="ml-auto w-fit md:pl-[34px]">
          {/* 가격 */}
          {discount_rate === 0 ? (
            <p className="ml-auto w-fit text-lg font-bold tracking-tighter text-gray-800">{original_price.toLocaleString('ko-KR')}원</p>
          ) : (
            <div className="justify-content flex flex-col items-end">
              <div>
                <p className="text-right text-[16px] font-bold leading-[18px] tracking-tighter text-red-600 md:text-[18px]">{discount_rate * 100}%</p>
                <p className="text-sm tracking-tighter text-gray-400 line-through">{original_price.toLocaleString('ko-KR')}원</p>
              </div>
              <p className="text-lg font-bold tracking-tighter text-gray-800">{calculateDiscountedPrice(original_price, discount_rate)}</p>
            </div>
          )}

          {/* 개수조절 */}
          <div className="ml-auto mt-2 flex w-fit flex-row items-center border border-gray-400/50">
            <div
              onClick={handleDecrease}
              className={clsx('flex h-8 w-8 cursor-pointer items-center justify-center bg-gray-200', {
                'cursor-not-allowed bg-gray-400': quantity <= 1,
              })}
            >
              <FaMinus className="text-xs" />
            </div>
            <input
              type="number"
              min={1}
              max={10}
              value={quantity}
              onChange={(event: any) => handleSetQuantity(event.target.value)}
              className="h-8 w-8 bg-white text-center text-xs font-semibold"
            />
            <div onClick={handleIncrease} className="flex h-8 w-8 cursor-pointer items-center justify-center bg-gray-200">
              <FaPlus className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
