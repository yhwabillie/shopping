'use client'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { TabItemType } from './UserShoppingTabs'
import { FaShoppingCart } from 'react-icons/fa'
import { FaStar } from 'react-icons/fa'
import { MdLocalShipping } from 'react-icons/md'
import { TbShoppingBagCheck } from 'react-icons/tb'
import { useCartlistStore } from '@/lib/stores/cartlistStore'

interface TabMenuProps {
  tabArr: TabItemType[]
}

export const TabMenu: React.FC<TabMenuProps> = ({ tabArr }: TabMenuProps) => {
  const { activeTabId, setActiveTab } = useCartlistStore()
  const activeTab = tabArr.find((tab) => tab.id === activeTabId)

  useEffect(() => {
    //초기 활성화 탭 초기화
    setActiveTab(3)
  }, [])

  return (
    <>
      <ul className="mb-4 flex flex-row gap-2 rounded-lg border-2 border-gray-200 bg-gray-200 md:mb-10">
        {tabArr.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={clsx(
              'flex w-[25%] cursor-pointer justify-center rounded-md px-2 py-3 text-center font-medium transition-colors duration-200 last:mr-0 md:px-5',
              {
                'bg-white text-gray-700': item.id === activeTabId,
                'border-transparent text-gray-500': item.id !== activeTabId,
              },
            )}
          >
            <button className="flex flex-col items-center justify-center gap-2 md:flex-row">
              {item.id === 1 && <MdLocalShipping className="text-xl" />}
              {item.id === 2 && <FaStar className="text-lg" />}
              {item.id === 3 && <FaShoppingCart className="text-lg" />}
              {item.id === 4 && <TbShoppingBagCheck className="text-xl" />}
              <span className="text-xs lg:text-sm">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="min-h-[420px]">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab && (
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {activeTab.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
