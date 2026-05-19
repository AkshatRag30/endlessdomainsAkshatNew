import { FormEvent, forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { FiSearch } from 'react-icons/fi'

import styles from './Input.module.scss'

// ─── Constants ────────────────────────────────────────────────────────────────

const PLACEHOLDER_DOMAINS = [
  'explorer.og',
  'beneath.eth',
  'hello.sol',
  'naruto.anime',
  'crypto.wallet',
  'defi.chain',
  'web3.bitcoin',
  'digital.nft',
  'metaverse.og',
  'blockchain.eth',
] as const

const TYPING_SPEED = 100
const DELETING_SPEED = 50
const PAUSE_DURATION = 2000

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'hero' | 'filter'
  showExtensions?: boolean
  initialQuery?: string
  onSearch?: (query: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'hero', showExtensions = true, initialQuery = '', onSearch, className, ...inputProps }, ref) => {
    const router = useRouter()

    const [query, setQuery] = useState(initialQuery)
    const [isSearching, setIsSearching] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [placeholder, setPlaceholder] = useState('')
    const [currentDomainIndex, setCurrentDomainIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    const typingRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
      const urlQuery = router.query.query as string | undefined
      const resolved = initialQuery || urlQuery || ''
      if (resolved) setQuery(resolved)
    }, [initialQuery, router.query.query])

    // ─── Typing placeholder animation (hero only) ──────────────────────────────

    useEffect(() => {
      if (variant !== 'hero') return

      if (isFocused || query) {
        setPlaceholder('Search your Web3 digital identity')
        return
      }

      const currentDomain = PLACEHOLDER_DOMAINS[currentDomainIndex]
      const currentText = placeholder

      const tick = () => {
        if (!isDeleting) {
          if (currentText.length < currentDomain.length) {
            setPlaceholder(currentDomain.slice(0, currentText.length + 1))
            typingRef.current = setTimeout(tick, TYPING_SPEED)
          } else {
            typingRef.current = setTimeout(() => setIsDeleting(true), PAUSE_DURATION)
          }
        } else {
          if (currentText.length > 0) {
            setPlaceholder(currentText.slice(0, -1))
            typingRef.current = setTimeout(tick, DELETING_SPEED)
          } else {
            setIsDeleting(false)
            setCurrentDomainIndex(prev => (prev + 1) % PLACEHOLDER_DOMAINS.length)
          }
        }
      }

      typingRef.current = setTimeout(tick, isDeleting ? DELETING_SPEED : TYPING_SPEED)

      return () => {
        if (typingRef.current) clearTimeout(typingRef.current)
      }
    }, [placeholder, currentDomainIndex, isDeleting, isFocused, query, variant])

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleSearch = useCallback(
      async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isSearching) return

        const formData = new FormData(e.currentTarget)
        const queryText = (formData.get('searchText') as string)?.trim()

        setIsSearching(true)
        try {
          if (onSearch) {
            onSearch(queryText)
          } else {
            await router.push(queryText ? `/search?query=${encodeURIComponent(queryText)}` : '/search')
          }
        } catch {
          // navigation errors are non-fatal
        } finally {
          setIsSearching(false)
        }
      },
      [router, isSearching, onSearch],
    )

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
    }, [])

    const handleFocus = useCallback(() => {
      setIsFocused(true)
      setPlaceholder('Search your Web3 digital identity')
    }, [])

    const handleBlur = useCallback(() => {
      setIsFocused(false)
      if (!query) {
        setPlaceholder('')
        setCurrentDomainIndex(0)
        setIsDeleting(false)
      }
    }, [query])

    // ─── Filter variant ────────────────────────────────────────────────────────

    if (variant === 'filter') {
      return (
        <div className={`${styles.filterContainer} ${className ?? ''}`}>
          <FiSearch className={styles.filterIcon} aria-hidden="true" />
          <input ref={ref} type="text" {...inputProps} className={styles.filterInput} />
        </div>
      )
    }

    // ─── Hero variant ──────────────────────────────────────────────────────────

    return (
      <div className={`${styles.searchWrapper} ${className ?? ''}`}>
        <div className={styles.searchContainer}>
          <form
            className={styles.inputContent}
            onSubmit={handleSearch}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          >
            <input
              ref={ref}
              name="searchText"
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={isSearching}
              className={styles.searchInput}
              aria-label="Search domain"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />

            <button
              type="submit"
              className={styles.searchButton}
              disabled={isSearching}
              aria-label={isSearching ? 'Searching...' : 'Search domain'}
            >
              {isSearching ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  <span className={styles.labelWrapper}>
                    <span className={styles.labelUp}>Searching...</span>
                    <span className={styles.labelUp}>Searching...</span>
                  </span>
                </>
              ) : (
                <>
                  <FiSearch className={styles.icon} aria-hidden="true" />
                  <span className={styles.labelWrapper}>
                    <span className={styles.labelUp}>Search Domain</span>
                    <span className={styles.labelUp}>Search Domain</span>
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  },
)

Input.displayName = 'Input'
export default Input
