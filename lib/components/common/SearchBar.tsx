'use client'
import { ProductType } from '@/app/actions/products/actions'
import { useProductsStore } from '@/lib/stores/productsStore'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { AiFillCloseCircle } from 'react-icons/ai'
import { LoadingSpinner } from './modules/LoadingSpinner'

interface SearchBarProps {
  isScrolled: boolean
}

export const SearchBar = ({ isScrolled }: SearchBarProps) => {
  const router = useRouter()
  const [isFocus, setIsFocus] = useState(false)
  const [inputValue, setInputValue] = useState('') // 검색어를 상태로 관리
  const [activeIndex, setActiveIndex] = useState(-2) // 활성화된 아이템의 인덱스 (-1은 기본값으로 검색창에 있는 값을 의미)
  const { setSearchQuery, selectSearchResult, autoCompleteSuggestions, loading, setAutoCompleteSuggestions } = useProductsStore()

  const searchBarRef = useRef<HTMLFieldSetElement>(null)
  const originalInputValue = useRef(inputValue) // 사용자가 입력한 원래 검색어를 저장

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    originalInputValue.current = event.target.value // 원래 검색어 업데이트
    setSearchQuery(event.target.value)

    setIsFocus(true) // 키보드 움직임이 감지되면 패널을 보이게 함
  }

  const handleSearch = (searchTerm?: string) => {
    const query = searchTerm || inputValue.trim()

    if (query) {
      router.push(`/search?query=${query}`)
      setIsFocus(false)
      setAutoCompleteSuggestions([]) // 자동완성 결과 초기화
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isFocus || loading) return

    switch (event.key) {
      case 'ArrowDown':
        setActiveIndex((prevIndex) => Math.min(prevIndex + 1, autoCompleteSuggestions.length - 1))
        event.preventDefault()
        break

      case 'ArrowUp':
        setActiveIndex((prevIndex) => (prevIndex <= 0 ? -1 : prevIndex - 1))
        event.preventDefault()
        break

      case 'Enter':
        if (activeIndex === -1) {
          handleSearch()
        } else {
          handleSearch(autoCompleteSuggestions[activeIndex]?.name)
        }
        setIsFocus(false)
        break

      case 'Escape':
        setAutoCompleteSuggestions([])
        setTimeout(() => setIsFocus(false), 0)
        break

      default:
        break
    }
  }

  const handleSuggestionClick = (suggestion: ProductType) => {
    selectSearchResult(suggestion)
    setSearchQuery(suggestion.name)
    setIsFocus(false)
    router.push(`/search?query=${suggestion.name}`)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
      setIsFocus(false)
    }
  }

  useEffect(() => {
    setActiveIndex(-2)
    setInputValue('')
    setAutoCompleteSuggestions([])

    if (isFocus) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isFocus])

  return (
    <fieldset ref={searchBarRef} className="relative z-20">
      <div
        className={clsx(
          'rounded-max border-1 relative mx-auto flex h-10 items-center justify-between border-primary bg-primary py-3 pl-6 pr-3 shadow-md',
          {
            'bg-white': isScrolled,
          },
        )}
      >
        <input
          value={inputValue}
          onKeyDown={handleKeyDown}
          onClick={() => setIsFocus(true)}
          onChange={handleInputChange}
          type="search"
          name="search"
          title="검색어"
          placeholder="제품 이름, 카테고리 검색"
          className={clsx('sm:text-md w-[120px] bg-primary placeholder:text-[14px] focus:outline-0 sm:w-[300px]', {
            'bg-white text-primary placeholder:text-primary/50': isScrolled,
            'text-white placeholder:text-white': !isScrolled,
          })}
        />
        {inputValue !== '' && (
          <button
            aria-label="delete search word button"
            type="button"
            onClick={() => {
              setInputValue('')
              setAutoCompleteSuggestions([]) // 검색어 초기화 시 자동완성 결과도 초기화
            }}
          >
            <AiFillCloseCircle className="text-xl text-white" />
          </button>
        )}
        <button aria-label="search button" type="button" className=" pl-3" onClick={() => handleSearch(inputValue)}>
          <IoSearch
            className={clsx('text-xl ', {
              'text-primary': isScrolled,
              'text-white': !isScrolled,
            })}
          />
        </button>

        {isFocus && (
          <div className="absolute left-0 top-[38px] flex w-full flex-col justify-between rounded-2xl bg-[#212325] py-4 text-sm shadow-md">
            <div
              className={clsx('flex items-center justify-center', {
                'h-auto': autoCompleteSuggestions.length > 0 && !loading,
                'min-h-[138px]': !(autoCompleteSuggestions.length > 0 && !loading),
              })}
            >
              {loading && (
                <div className="mx-auto w-fit pb-10">
                  <LoadingSpinner />
                </div>
              )}
              {/* 자동완성 결과 */}
              {autoCompleteSuggestions.length > 0 && !loading && (
                <ul className="flex w-full flex-col self-start">
                  {autoCompleteSuggestions.map((suggestion, index) => (
                    <li
                      key={suggestion.idx}
                      onMouseDown={() => handleSuggestionClick(suggestion)} // 클릭 시 focus 유지
                      className={clsx(
                        'autocomplete-item flex cursor-pointer items-start justify-start gap-2 px-3 py-2 text-white hover:bg-gray-500',
                        {
                          'bg-gray-600': index === activeIndex, // 활성화된 항목에 스타일 적용
                        },
                      )}
                    >
                      <IoSearch className="!text-xl" />
                      <span className="inline-block w-[calc(100%-20px)]">{suggestion.name}</span>
                    </li>
                  ))}
                </ul>
              )}

              {autoCompleteSuggestions.length === 0 && !loading && (
                <p className="p-2 text-center text-sm text-[#9da5b6]">제품 이름 혹은 카테고리를 검색하세요</p>
              )}
            </div>
          </div>
        )}
      </div>
    </fieldset>
  )
}
