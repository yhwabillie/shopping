'use client'

import clsx from 'clsx'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Button } from './Button'
import { FaCheck } from 'react-icons/fa'
import { deleteSelectedProductsByIdx } from '@/app/actions/upload-product/actions'
import { useRouter } from 'next/navigation'
import { object } from 'zod'

interface ItemsType {
  [key: string]: boolean
}

export const ProductList = ({ data: { data } }: any) => {
  const router = useRouter()
  const [items, setItems] = useState<ItemsType>({})
  const [isAllChecked, setIsAllChecked] = useState(false)
  const { register, watch, reset, setValue, getValues } = useForm<FieldValues>({
    mode: 'onChange',
  })

  const checkAllRef = useRef<HTMLInputElement>(null)

  const toggleItems = (newItems: { [key: string]: boolean }) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems }

      Object.keys(newItems).forEach((key) => {
        if (!prevItems.hasOwnProperty(key)) {
          updatedItems[key] = true
        }
      })

      return updatedItems
    })
  }

  const toggleItem = (key: any, isChecked: boolean) => {
    setItems((prevItems) => {
      if (isChecked) {
        // Check: Set the value to true
        return { ...prevItems, [key]: true }
      }

      return { ...prevItems, [key]: false }
    })
  }

  const deleteSelectedProducts = async () => {
    console.log('go Server===>', items)

    const result = Object.keys(items).reduce((acc: any, key: any) => {
      if (items[key] === true) {
        acc[key] = items[key]
      }
      return acc
    }, {})

    console.log(result, '///')

    const response = await deleteSelectedProductsByIdx(result)
    console.log(response)

    router.refresh()
    setItems({})
    data.forEach((item: any) => {
      setValue(item.idx, false)
    })
    if (!checkAllRef.current) return
    checkAllRef.current.checked = false
    setIsAllChecked(false)
  }

  const handleChangeCheckAll = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.currentTarget.checked

    if (isChecked) {
      const result = data.reduce((acc: any, item: any) => {
        acc[item.idx] = true
        return acc
      }, {})

      data.forEach((item: any) => {
        setValue(item.idx, true)
      })

      setIsAllChecked(true)
      setItems(result)
    } else if (!isChecked) {
      const result = data.reduce((acc: any, item: any) => {
        acc[item.idx] = false
        return acc
      }, {})

      data.forEach((item: any) => {
        setValue(item.idx, false)
      })

      setIsAllChecked(false)
      setItems(result)
    }
  }

  console.log('current items', items)

  return (
    <>
      <div className="flex flex-row justify-end gap-2">
        <div className="w-[230px]">
          <Button label="전체 Excel 다운로드" disalbe={true} />
        </div>
        <div className="w-[150px]">
          <Button label="선택 삭제" clickEvent={deleteSelectedProducts} />
        </div>
      </div>
      <table className="mt-5 w-full border-collapse">
        <thead className="bg-gray-100">
          <tr className="h-10 border-b border-gray-300">
            <th className="box-border w-[5%]">
              <label htmlFor="check_all" className="mx-auto flex h-4 w-4 items-center justify-center border border-gray-500/50">
                <input ref={checkAllRef} id="check_all" type="checkbox" onChange={handleChangeCheckAll} />
                {isAllChecked && <FaCheck />}
              </label>
            </th>
            <th className="w-[50%] text-center text-sm">이름</th>
            <th className="w-[10%] text-center text-sm">카테고리</th>
            <th className="w-[10%] text-center text-sm">정가</th>
            <th className="w-[10%] text-center text-sm">할인</th>
            <th className="w-[15%] text-center text-sm">판매가</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index: number) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="w-[5%]">
                <label htmlFor={item.idx} className="mx-auto flex h-4 w-4 items-center justify-center border border-gray-500/50">
                  <input
                    {...register(`${item.idx}`)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const isChecked = event.target.checked

                      if (isChecked) {
                        setValue(`${item.idx}`, isChecked)
                        toggleItem(`${item.idx}`, isChecked)
                      } else if (!isChecked) {
                        setValue(`${item.idx}`, isChecked)
                        toggleItem(`${item.idx}`, isChecked)
                      }

                      console.log(
                        Object.values(getValues()).every((item: any) => item === true),
                        '///',
                      )

                      if (Object.values(getValues()).every((item: any) => item === true)) {
                        if (!checkAllRef.current) return
                        checkAllRef.current.checked = true
                        setIsAllChecked(true)
                      } else {
                        if (!checkAllRef.current) return
                        checkAllRef.current.checked = false
                        setIsAllChecked(false)
                      }
                    }}
                    type="checkbox"
                    id={item.idx}
                  />
                  {getValues(`${item.idx}`) && <FaCheck />}
                </label>
              </td>
              <td className="box-border w-[50%] break-all p-2 text-left text-sm">{item.name}</td>
              <td className="box-border w-[15%] text-center text-sm">{item.category}</td>
              <td className="box-border w-[10%] text-center text-sm">{item.original_price.toLocaleString('ko-KR')}</td>
              <td className="box-border w-[10%] text-center text-sm">{`${item.discount_rate * 100}%`}</td>
              <td className="box-border w-[10%] pr-2 text-right text-sm">
                {`${(item.original_price - item.original_price * item.discount_rate).toLocaleString('ko-KR')}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
