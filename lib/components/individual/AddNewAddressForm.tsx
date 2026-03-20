'use client'
import { AddNewAddressFormSchema, AddNewAddressFormSchemaType } from '@/lib/zodSchema'
import { useAddressStore } from '@/lib/stores/addressStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { IoIosArrowDown } from 'react-icons/io'
import clsx from 'clsx'

export const AddNewAddressForm = () => {
  const { showModal, hideModal, new_address, createNewAddressData, updatePostcode } = useAddressStore()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddNewAddressFormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(AddNewAddressFormSchema),
  })

  //submit 버튼 비활성화 조건 (모든 watch값이 ''이 아니거나 errors 개수가 1개이상)
  const isSubmitDisabled = !Object.values(watch()).every((item: any) => item !== '') || Object.keys(errors).length > 0

  useEffect(() => {
    setValue('new_postcode', new_address.new_postcode)
    setValue('new_addressLine1', new_address.new_addressLine1)
  }, [new_address])

  return (
    <div className="fixed left-0 top-0 z-[40] flex h-full w-full items-center justify-center overflow-y-auto bg-[rgba(0,0,0,0.4)] backdrop-blur-sm">
      <div className="mb-auto mt-auto">
        <form
          onSubmit={handleSubmit(createNewAddressData)}
          className="relative my-6 h-fit w-[320px] rounded-2xl bg-white p-4 shadow-lg md:mx-[20px] md:my-[50px] md:w-[600px] md:p-10"
        >
          <h2 className="mb-5 block text-center text-lg font-semibold tracking-tighter md:text-2xl">배송지 정보 추가</h2>
          <fieldset className="h-auto min-h-[600px] overflow-y-auto">
            <label htmlFor="addressName" className="relative mb-3 block w-full drop-shadow-md">
              <span
                className={clsx('absolute left-4 top-2 block text-sm font-medium text-blue-500', {
                  'text-red-500': errors.addressName,
                })}
              >
                배송지 이름
              </span>
              <input
                {...register('addressName')}
                id="addressName"
                type="text"
                className={clsx(
                  'leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal',
                  {
                    'border-red-500': errors.addressName,
                  },
                )}
                placeholder="배송지 이름을 작성해주세요"
                autoFocus={true}
              />
              {errors.addressName && <p className="mt-1 px-2 text-sm text-red-500">{errors.addressName.message}</p>}
            </label>

            <label htmlFor="recipientName" className="relative mb-3 block w-full drop-shadow-md">
              <span
                className={clsx('absolute left-4 top-2 block text-sm font-medium text-blue-500', {
                  'text-red-500': errors.recipientName,
                })}
              >
                수령인 이름
              </span>
              <input
                {...register('recipientName')}
                id="recipientName"
                type="text"
                className={clsx(
                  'leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal',
                  {
                    'border-red-500': errors.recipientName,
                  },
                )}
                placeholder="수령인 이름을 작성해주세요"
              />
              {errors.recipientName && <p className="mt-1 px-2 text-sm text-red-500">{errors.recipientName.message}</p>}
            </label>

            <label htmlFor="phoneNumber" className="relative mb-8 block w-full drop-shadow-md">
              <span
                className={clsx('absolute left-4 top-2 block text-sm font-medium text-blue-500', {
                  'text-red-500': errors.phoneNumber,
                })}
              >
                연락처
              </span>
              <input
                {...register('phoneNumber')}
                id="phoneNumber"
                type="text"
                className={clsx(
                  'leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal',
                  {
                    'border-red-500': errors.phoneNumber,
                  },
                )}
                placeholder="연락처를 작성해주세요"
              />
              {errors.phoneNumber && <p className="mt-1 px-2 text-sm text-red-500">{errors.phoneNumber.message}</p>}
            </label>

            <div className="mb-8">
              <div className="mb-3 flex flex-row items-center gap-2">
                <label htmlFor="new_postcode" className="relative block w-[140px] drop-shadow-md">
                  <span
                    className={clsx('absolute left-4 top-2 block text-sm font-medium text-blue-500', {
                      'text-red-500': errors.new_postcode && (watch('new_postcode') === undefined || watch('new_postcode') === ''),
                    })}
                  >
                    우편번호
                  </span>
                  <input
                    {...register('new_postcode')}
                    id="new_postcode"
                    type="text"
                    className={clsx(
                      'leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal',
                      {
                        'border-red-500': errors.new_postcode && (watch('new_postcode') === undefined || watch('new_postcode') === ''),
                      },
                    )}
                    placeholder="우편번호"
                    readOnly
                  />
                </label>
                <button
                  type="button"
                  onClick={() => showModal('postcode')}
                  className={clsx(
                    'box-border h-[63px] w-[100px] rounded-md bg-blue-400 text-sm font-semibold text-white drop-shadow-md hover:bg-blue-500',
                    {
                      'bg-red-400 hover:bg-red-600':
                        (errors.new_postcode || errors.new_addressLine1) && (watch('new_postcode') === undefined || watch('new_postcode') === ''),
                    },
                  )}
                >
                  주소 찾기
                </button>
              </div>

              <label htmlFor="new_addressLine1" className="relative mb-3 block w-full drop-shadow-md">
                <span
                  className={clsx('absolute left-4 top-2 block text-sm font-medium text-blue-500', {
                    'text-red-500': errors.new_addressLine1 && (watch('new_addressLine1') === undefined || watch('new_addressLine1') === ''),
                  })}
                >
                  주소
                </span>
                <input
                  {...register('new_addressLine1')}
                  id="new_addressLine1"
                  type="text"
                  className={clsx(
                    'leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal',
                    {
                      'border-red-500': errors.new_addressLine1 && (watch('new_addressLine1') === undefined || watch('new_addressLine1') === ''),
                    },
                  )}
                  placeholder="주소"
                  readOnly
                />
              </label>

              <label htmlFor="addressLine2" className="relative block w-full drop-shadow-md">
                <span
                  className={clsx('absolute left-4 top-2 block text-sm font-medium text-blue-500', {
                    'text-red-500': errors.addressLine2,
                  })}
                >
                  상세주소
                </span>
                <input
                  {...register('addressLine2')}
                  id="addressLine2"
                  type="text"
                  className={clsx(
                    'leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal',
                    {
                      'border-red-500': errors.addressLine2,
                    },
                  )}
                  placeholder="상세주소"
                />
                {errors.addressLine2 && <p className="mt-1 px-2 text-sm text-red-500">{errors.addressLine2.message}</p>}
              </label>
            </div>

            <label htmlFor="deliveryNote" className="relative mb-3 block w-full drop-shadow-md">
              <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">배송요청사항</span>

              <select
                {...register('deliveryNote')}
                id="deliveryNote"
                className="h-[62px] appearance-none bg-transparent leading-normal block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
              >
                <option value={'문 앞에 부탁드립니다'}>문 앞에 부탁드립니다.</option>
                <option value={'부재시 연락 부탁드립니다'}>부재시 연락 부탁드립니다.</option>
                <option value={'배송 전 미리 연락해주세요'}>배송 전 미리 연락해주세요.</option>
              </select>

              <IoIosArrowDown className="absolute right-[15px] top-[20px] text-2xl text-blue-500" />
            </label>
          </fieldset>

          <div className="flex w-full flex-row justify-center gap-2 pt-5">
            <button
              type="button"
              onClick={() => {
                updatePostcode({})
                hideModal('addNewAddress')
              }}
              className="w-[50%] rounded-md bg-gray-400 p-3 font-semibold text-white drop-shadow-sm hover:bg-gray-500 "
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-[50%] rounded-md bg-blue-400 p-3 font-semibold text-white drop-shadow-sm  hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
