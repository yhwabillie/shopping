'use client'
import { createBulkProduct, Product } from '@/app/actions/upload-product/actions'
import { useState } from 'react'
import { Button } from '@/lib/components/common/modules/Button'
import { FieldValues, useForm } from 'react-hook-form'
import { useProductStore } from '@/lib/zustandStore'
import * as XLSX from 'xlsx'

export const ProductUploadForm = () => {
  const [updateLoading, setUpdateLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { productState } = useProductStore()
  const { setProductState } = useProductStore((state) => state)
  const { register, setValue, getValues, resetField } = useForm<FieldValues>({
    mode: 'onChange',
  })

  const handleClickSaveData = async () => {
    if (!file) return

    try {
      setUpdateLoading(true)

      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array', dense: true })

      const sheetName = workbook.SheetNames[0]
      const workSheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json<Product>(workSheet)

      await createBulkProduct(json)
      setProductState(true)

      setFileName('')
      setFile(null)
      resetField('upload')
    } catch (error) {
      console.error('Failed to upload products:', error)
    } finally {
      setUpdateLoading(false)
    }
  }

  return (
    <section aria-labelledby="upload-form-heading">
      <h4 id="upload-form-heading" className="sr-only">
        상품 데이터 업로드 폼
      </h4>
      <fieldset className="mb-5 flex flex-row justify-center">
        <input
          className="text-md box-border h-[50px] w-[400px] rounded-bl-md rounded-tl-md border border-gray-500/50 p-3 px-5 text-gray-500/40 shadow-md placeholder:text-gray-500/40 focus:outline-0"
          type="text"
          value={fileName}
          readOnly
          placeholder="업로드할 엑셀 파일을 선택하세요"
        />
        <label
          htmlFor="upload"
          className="text-md box-border h-[50px] w-[70px] cursor-pointer rounded-br-md rounded-tr-md border-gray-500/50 bg-blue-400 pt-[13px] text-center text-white shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500"
        >
          선택
        </label>
        <input
          {...register('upload')}
          id="upload"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files

            if (files && files.length === 1) {
              setFileName(files[0].name)
              setFile(files[0])
            } else {
              setFileName('')
              setFile(null)
            }
          }}
          type="file"
          accept=".xlsx, .xls"
        />
      </fieldset>
      <div className="mb-20 flex justify-center gap-2">
        <div className="w-[200px]">
          <Button
            label="데이터 업로드"
            clickEvent={handleClickSaveData}
            spinner={updateLoading}
            disalbe={file === null || getValues('upload') === undefined || getValues('upload') === null || updateLoading}
          />
        </div>
        <div className="w-[200px]">
          <Button
            label="선택 데이터 리셋"
            clickEvent={() => {
              setFileName('')
              setValue('upload', null)
            }}
            disalbe={file === null || getValues('upload') === undefined || getValues('upload') === null}
          />
        </div>
      </div>
    </section>
  )
}
