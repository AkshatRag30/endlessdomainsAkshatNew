import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { FiSearch, FiX } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import styles from './DomainSearchBar.module.scss'

const NORMAL_PLACEHOLDER_DOMAINS = ['explorer.og', 'metaverse.eth', 'digital.sol', 'crypto.wallet', 'identity.nft'] as const
const AI_PLACEHOLDER = '#Describe what you want — e.g., italian first names'

const TYPING_SPEED = 100
const DELETING_SPEED = 50
const PAUSE_DURATION = 2000

interface DomainSearchBarProps {
  aiMode: boolean
  query: string
  onQueryChange: (query: string) => void
  creditsUsed?: number
  creditsTotal?: number
}

export function DomainSearchBar({ aiMode, query, onQueryChange, creditsUsed = 50, creditsTotal = 100 }: DomainSearchBarProps) {
  const router = useRouter()

  const [isSearching, setIsSearching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const [domainIndex, setDomainIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const typingRef = useRef<NodeJS.Timeout | null>(null)

  // Normal mode types out example domains; AI mode shows a static prompt hint
  useEffect(() => {
    if (aiMode) {
      setPlaceholder(AI_PLACEHOLDER)
      return
    }

    if (isFocused || query) {
      setPlaceholder('Search your Web3 digital identity')
      return
    }

    const currentDomain = NORMAL_PLACEHOLDER_DOMAINS[domainIndex]
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
          setDomainIndex(prev => (prev + 1) % NORMAL_PLACEHOLDER_DOMAINS.length)
        }
      }
    }

    typingRef.current = setTimeout(tick, isDeleting ? DELETING_SPEED : TYPING_SPEED)

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current)
    }
  }, [aiMode, placeholder, domainIndex, isDeleting, isFocused, query])

  // Reset the typing animation whenever mode switches
  useEffect(() => {
    setPlaceholder('')
    setDomainIndex(0)
    setIsDeleting(false)
  }, [aiMode])

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (isSearching) return

      const trimmed = query.trim()
      setIsSearching(true)
      try {
        if (aiMode) {
          await router.push(trimmed ? `/domain-search/ai?prompt=${encodeURIComponent(trimmed)}` : '/domain-search/ai')
        } else {
          await router.push(trimmed ? `/search?query=${encodeURIComponent(trimmed)}` : '/search')
        }
      } catch {
        // navigation errors are non-fatal
      } finally {
        setIsSearching(false)
      }
    },
    [aiMode, query, router, isSearching],
  )

  const handleClear = useCallback(() => onQueryChange(''), [onQueryChange])

  return (
    <div className={styles.searchWrapper}>
      <span className={styles.creditPill}>
        <HiSparkles size={12} aria-hidden="true" />
        {creditsUsed}/{creditsTotal} credit
      </span>

      <div className={styles.searchContainer}>
        <form
          className={styles.inputContent}
          onSubmit={handleSubmit}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        >
          <span className={styles.leadingIcon} aria-hidden="true">
            <HiSparkles size={18} />
          </span>

          <input
            type="text"
            name="searchText"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isSearching}
            className={styles.searchInput}
            aria-label={aiMode ? 'Describe the domain you want' : 'Search domain'}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />

          {query && (
            <button type="button" className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
              <FiX size={16} aria-hidden="true" />
            </button>
          )}

          <button type="submit" className={styles.searchButton} disabled={isSearching} aria-label={aiMode ? 'Generate Domain' : 'Search Domain'}>
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
                {aiMode ? <HiSparkles className={styles.icon} aria-hidden="true" /> : <FiSearch className={styles.icon} aria-hidden="true" />}
                <span className={styles.labelWrapper}>
                  <span className={styles.labelUp}>{aiMode ? 'Generate Domain' : 'Search Domain'}</span>
                  <span className={styles.labelUp}>{aiMode ? 'Generate Domain' : 'Search Domain'}</span>
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default DomainSearchBar
