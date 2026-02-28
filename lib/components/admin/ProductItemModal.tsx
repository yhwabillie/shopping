'use client'
import { Product } from '@prisma/client'
import React, { useState, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: any
  product: Product
  onSave: any
}

export const ProductItemModal: React.FC<ModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [editedProduct, setEditedProduct] = useState<Product>(product)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setEditedProduct(product)
    setImageError(false)
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setEditedProduct({
      ...editedProduct,
      [name]: name === 'discount_rate' || name === 'original_price' ? parseFloat(value) : value,
    })
  }

  const handleSave = () => {
    onSave(editedProduct)
  }

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-[1px]">
      <div className="w-11/12 rounded bg-white p-6 shadow-lg md:w-1/2 lg:w-1/3">
        <h2 className="mb-4 text-xl font-bold">제품 정보 수정</h2>
        <div className="mb-4 overflow-hidden rounded border border-gray-200 bg-gray-50">
          {editedProduct.imageUrl?.trim() && !imageError ? (
            <img
              src={editedProduct.imageUrl}
              alt={editedProduct.name}
              className="h-48 w-full object-contain"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <img src="/images/no-image.svg" alt="no image" className="h-48 w-full object-contain" />
          )}
        </div>
        <div className="mb-4">
          <label className="mb-1 block">Product Name:</label>
          <input type="text" name="name" value={editedProduct.name} onChange={handleChange} className="w-full rounded border px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="mb-1 block">가격:</label>
          <input
            type="number"
            name="original_price"
            value={editedProduct.original_price}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block">할인율:</label>
          <input
            type="number"
            name="discount_rate"
            value={editedProduct.discount_rate ? editedProduct.discount_rate : 0}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block">제품 이미지 URL:</label>
          <input type="text" name="imageUrl" value={editedProduct.imageUrl} onChange={handleChange} className="w-full rounded border px-3 py-2" />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 rounded bg-gray-500 px-4 py-2 text-white">
            취소
          </button>
          <button onClick={handleSave} className="rounded bg-blue-500 px-4 py-2 text-white">
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
