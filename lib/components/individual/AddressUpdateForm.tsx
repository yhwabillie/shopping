'use client'
import { AddressFormSchema, AddressFormSchemaType } from '@/lib/zodSchema'
import { useAddressStore } from '@/lib/stores/addressStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoIosArrowDown } from 'react-icons/io'
import clsx from 'clsx'

export const AddressUpdateForm = () => {
  const { edit_address, data, addressIdx, setAddressIdx, showModal, hideModal, createAddress, setEditAddress, updatePostcode } = useAddressStore()
  const { register, handleSubmit, setValue, watch } = useForm<AddressFormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      addressName: edit_address.addressName,
      recipientName: edit_address.recipientName,
      phoneNumber: edit_address.phoneNumber,
      postcode: edit_address.postcode,
      addressLine1: edit_address.addressLine1,
      addressLine2: edit_address.addressLine2,
      deliveryNote: edit_address.deliveryNote,
    },
  })

  //연락처 regex
  const phoneNumber_value = watch('phoneNumber')
  const phoneNumber_pattern = /^010\d{8}$/
  const isValidPhoneNumber = phoneNumber_pattern.test(phoneNumber_value)

  //변경전 원본 데이터
  const [dataFromDB] = data.filter((item) => item.idx === addressIdx)
  const { idx, isDefault, ...initialData } = dataFromDB || {}

  //변경전과 후가 같은지 체크
  const isChanged = JSON.stringify(initialData) !== JSON.stringify(watch())

  //submit 버튼 비활성화 조건 (빈값의 경우, 연락처 정규식에 맞지않는 경우, 최초 데이터와 변경후 데이터가 같을 경우)
  const isSubmitDisabled = !Object.values(watch()).every((item: any) => item !== '') || !isValidPhoneNumber || !isChanged

  useEffect(() => {
    if (!edit_address?.idx) return

    setAddressIdx(edit_address.idx)
    setValue('postcode', edit_address.postcode)
    setValue('addressLine1', edit_address.addressLine1)
  }, [edit_address])

  return (
    <div className="fixed left-0 top-0 z-[40] flex h-full w-full items-center justify-center overflow-y-auto bg-[rgba(0,0,0,0.4)] backdrop-blur-sm">
      <div className="mb-auto mt-auto">
        <form
          onSubmit={handleSubmit(createAddress)}
          className="relative my-6 h-fit w-[320px] rounded-2xl bg-white p-4 shadow-lg md:mx-[20px] md:my-[50px] md:w-[600px] md:p-10"
        >
          <h2 className="mb-5 block text-center text-lg font-semibold tracking-tighter md:text-2xl">배송지 정보 수정</h2>
          {!isChanged && <p className="mb-2 text-sm text-blue-600">변경사항이 없습니다.</p>}

          <fieldset className="h-auto min-h-[600px] overflow-y-auto">
            <label htmlFor="addressName" className="relative mb-3 block w-full drop-shadow-md">
              <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">배송지 이름</span>
              <input
                {...register('addressName')}
                id="addressName"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setValue('addressName', event.target.value)
                  setEditAddress({ ...edit_address, addressName: event.target.value })
                }}
                type="text"
                className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                placeholder="배송지 이름을 작성해주세요"
              />
            </label>

            <label htmlFor="recipientName" className="relative mb-3 block w-full drop-shadow-md">
              <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">수령인 이름</span>
              <input
                {...register('recipientName')}
                id="recipientName"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setValue('recipientName', event.target.value)
                  setEditAddress({ ...edit_address, recipientName: event.target.value })
                }}
                type="text"
                className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                placeholder="수령인 이름을 작성해주세요"
              />
            </label>

            <label htmlFor="phoneNumber" className="relative mb-8 block w-full drop-shadow-md">
              <span
                className={clsx('absolute left-4 top-2 block text-sm font-medium text-blue-500', {
                  'text-red-500': !isValidPhoneNumber,
                })}
              >
                연락처
              </span>
              <input
                {...register('phoneNumber')}
                id="phoneNumber"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setValue('phoneNumber', event.target.value)
                  setEditAddress({ ...edit_address, phoneNumber: event.target.value })
                }}
                type="text"
                className={clsx(
                  'leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal',
                  {
                    'border-red-500': !isValidPhoneNumber,
                  },
                )}
                placeholder="연락처를 작성해주세요"
              />
              {!isValidPhoneNumber && <p className="mt-1 px-2 text-sm text-red-500">-없이 작성해주세요</p>}
            </label>

            <div className="mb-8">
              <div className="mb-3 flex flex-row items-center gap-2">
                <label htmlFor="postcode" className="relative block w-[140px] drop-shadow-md">
                  <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">우편번호</span>
                  <input
                    {...register('postcode')}
                    id="postcode"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setValue('postcode', event.target.value)
                      setEditAddress({ ...edit_address, postcode: event.target.value })
                    }}
                    type="text"
                    className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                    placeholder="우편번호"
                    readOnly
                  />
                </label>
                <button
                  type="button"
                  onClick={() => showModal('postcode')}
                  className="box-border h-[63px] w-[100px] rounded-md bg-blue-400 text-sm font-semibold text-white drop-shadow-md hover:bg-blue-500"
                >
                  주소 찾기
                </button>
              </div>

              <label htmlFor="addressLine1" className="relative mb-3 block w-full drop-shadow-md">
                <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">주소</span>
                <input
                  {...register('addressLine1')}
                  id="addressLine1"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setValue('addressLine1', event.target.value)
                    setEditAddress({ ...edit_address, addressLine1: event.target.value })
                  }}
                  type="text"
                  className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                  placeholder="주소"
                  readOnly
                />
              </label>

              <label htmlFor="addressLine2" className="relative block w-full drop-shadow-md">
                <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">상세주소</span>
                <input
                  {...register('addressLine2')}
                  id="addressLine2"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setValue('addressLine2', event.target.value)
                    setEditAddress({ ...edit_address, addressLine2: event.target.value })
                  }}
                  type="text"
                  className="leading-1 block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                  placeholder="상세주소"
                />
              </label>
            </div>

            <label htmlFor="deliveryNote" className="relative mb-3 block w-full drop-shadow-md">
              <span className="absolute left-4 top-2 block text-sm font-medium text-blue-500">배송요청사항</span>

              <select
                {...register('deliveryNote')}
                id="deliveryNote"
                className="h-[62px] appearance-none bg-transparent leading-normal block w-full rounded-md border border-blue-400 px-[15px] pb-[10px] pt-[27px] font-normal text-gray-700 outline-0 placeholder:font-normal"
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  setValue('deliveryNote', event.target.value)
                  setEditAddress({ ...edit_address, deliveryNote: event.target.value })
                }}
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
                hideModal('editAddress')
              }}
              className="w-[50%] rounded-md bg-gray-200 p-3 font-semibold text-gray-700 drop-shadow-sm hover:bg-gray-300 "
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
