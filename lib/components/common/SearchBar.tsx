'use client'
import { ProductType } from '@/app/actions/products/actions'
import { useProductsStore } from '@/lib/stores/productsStore'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { AiFillCloseCircle } from 'react-icons/ai'
import { LoadingSpinner } from './modules/LoadingSpinner'

interface SearchBarProps {
  isScrolled: boolean
}

export const SearchBar = ({ isScrolled }: SearchBarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isFocus, setIsFocus] = useState(false)
  const [inputValue, setInputValue] = useState('') // 검색어를 상태로 관리
  const [activeIndex, setActiveIndex] = useState(-1)
  const { setSearchQuery, selectSearchResult, autoCompleteSuggestions, autoCompleteLoading, setAutoCompleteSuggestions } = useProductsStore()

  const searchBarRef = useRef<HTMLFieldSetElement>(null)
  const listboxId = useId()
  const normalizedCurrentQuery = (searchParams.get('query') || '').trim()
  const visibleSuggestions = useMemo(() => autoCompleteSuggestions.slice(0, 8), [autoCompleteSuggestions])

  const highlightMatchedText = (text: string, query: string) => {
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      return text
    }

    const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const matchRegex = new RegExp(`(${escapedQuery})`, 'ig')
    const segments = text.split(matchRegex)

    return segments.map((segment, index) =>
      segment.toLowerCase() === normalizedQuery.toLowerCase() ? (
        <mark key={`${segment}-${index}`} className="rounded bg-blue-500/30 px-0.5 text-white">
          {segment}
        </mark>
      ) : (
        <span key={`${segment}-${index}`}>{segment}</span>
      ),
    )
  }

  const executeSearch = (rawTerm?: string) => {
    const query = (rawTerm ?? inputValue).trim()

    if (!query) {
      return
    }

    const encodedQuery = encodeURIComponent(query)
    const isSameSearchPageQuery = pathname === '/search' && normalizedCurrentQuery.toLowerCase() === query.toLowerCase()

    setInputValue(query)
    setSearchQuery(query)
    setAutoCompleteSuggestions([])
    setIsFocus(false)
    setActiveIndex(-1)

    if (!isSameSearchPageQuery) {
      router.push(`/search?query=${encodedQuery}`)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextInputValue = event.target.value

    setInputValue(nextInputValue)
    setSearchQuery(nextInputValue)

    setIsFocus(true) // 키보드 움직임이 감지되면 패널을 보이게 함
    setActiveIndex(-1)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isFocus || autoCompleteLoading) return

    switch (event.key) {
      case 'ArrowDown':
        setActiveIndex((prevIndex) => Math.min(prevIndex + 1, visibleSuggestions.length - 1))
        event.preventDefault()
        break

      case 'ArrowUp':
        setActiveIndex((prevIndex) => (prevIndex <= 0 ? -1 : prevIndex - 1))
        event.preventDefault()
        break

      case 'Enter':
        event.preventDefault()
        if (activeIndex === -1) {
          executeSearch()
        } else {
          executeSearch(visibleSuggestions[activeIndex]?.name)
        }
        break

      case 'Escape':
        setAutoCompleteSuggestions([])
        setIsFocus(false)
        setActiveIndex(-1)
        break

      default:
        break
    }
  }

  const handleSuggestionClick = (suggestion: ProductType) => {
    selectSearchResult(suggestion)
    executeSearch(suggestion.name)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
      setIsFocus(false)
    }
  }

  useEffect(() => {
    if (isFocus) {
      document.addEventListener('pointerdown', handleClickOutside)
    } else {
      document.removeEventListener('pointerdown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [isFocus])

  useEffect(() => {
    if (!isFocus) {
      setActiveIndex(-1)
      return
    }

    if (activeIndex >= visibleSuggestions.length) {
      setActiveIndex(-1)
    }
  }, [activeIndex, isFocus, visibleSuggestions.length])

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
          onFocus={() => setIsFocus(true)}
          onChange={handleInputChange}
          type="search"
          name="search"
          title="검색어"
          role="combobox"
          aria-expanded={isFocus}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${visibleSuggestions[activeIndex]?.idx}` : undefined}
          aria-autocomplete="list"
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
              setSearchQuery('')
              setActiveIndex(-1)
              setAutoCompleteSuggestions([]) // 검색어 초기화 시 자동완성 결과도 초기화
            }}
          >
            <AiFillCloseCircle className="text-xl text-white" />
          </button>
        )}
        <button aria-label="search button" type="button" className=" pl-3" onClick={() => executeSearch(inputValue)}>
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
                'h-auto': visibleSuggestions.length > 0 && !autoCompleteLoading,
                'min-h-[138px]': !(visibleSuggestions.length > 0 && !autoCompleteLoading),
              })}
            >
              {autoCompleteLoading && (
                <div className="mx-auto w-fit pb-10">
                  <LoadingSpinner />
                </div>
              )}
              {/* 자동완성 결과 */}
              {visibleSuggestions.length > 0 && !autoCompleteLoading && (
                <ul id={listboxId} role="listbox" className="flex w-full flex-col self-start" aria-label="검색 자동완성">
                  {visibleSuggestions.map((suggestion, index) => (
                    <li
                      id={`suggestion-${suggestion.idx}`}
                      role="option"
                      aria-selected={index === activeIndex}
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
                      <span className="inline-block w-[calc(100%-20px)]">{highlightMatchedText(suggestion.name, inputValue)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {visibleSuggestions.length === 0 && !autoCompleteLoading && (
                <p className="p-2 text-center text-sm text-[#9da5b6]">제품 이름 혹은 카테고리를 검색하세요</p>
              )}
            </div>
          </div>
        )}
      </div>
    </fieldset>
  )
}
