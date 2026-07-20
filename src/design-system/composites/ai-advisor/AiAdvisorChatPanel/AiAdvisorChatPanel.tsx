import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { FiArrowUp, FiUser } from 'react-icons/fi'

import styles from './AiAdvisorChatPanel.module.scss'

const SUGGESTIONS = [
  'Portfolio Overview',
  'Monetize Domains',
  'Domain Use Cases',
  'Expiry Alerts',
  'Compare Providers',
  'Web3 Identity',
  'Marketplace Listings',
  'Parked Domains',
]

const MAX_CREDITS = 100

// design-specific: placeholder reply text, matching the Figma reference — swap for a real AI
// response once the backend is wired up
const MOCK_REPLY =
  "Token2049 Dubai is one of the world's most prominent Web3 events, bringing together the global crypto ecosystem under one roof. Endless Domains participated as a featured exhibitor and speaker, presenting the vision of a self-sovereign digital identity layer for the open internet."

export interface AiAdvisorMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export interface AiAdvisorChatPanelProps {
  creditsUsed?: number
  onSubmit?: (query: string) => void
  onSuggestionClick?: (suggestion: string) => void
}

export function AiAdvisorChatPanel({ creditsUsed = 50, onSubmit, onSuggestionClick }: AiAdvisorChatPanelProps) {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<AiAdvisorMessage[]>([])
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const thread = threadRef.current
    if (!thread) return
    thread.scrollTop = thread.scrollHeight
  }, [messages])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value)
  }, [])

  const submitQuery = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      setMessages(prev => {
        const messageId = `${prev.length}-${trimmed.slice(0, 8)}`
        return [
          ...prev,
          { id: `${messageId}-user`, role: 'user', text: trimmed },
          { id: `${messageId}-assistant`, role: 'assistant', text: MOCK_REPLY },
        ]
      })
      onSubmit?.(trimmed)
      setQuery('')
    },
    [onSubmit],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      submitQuery(query)
    },
    [query, submitQuery],
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      onSuggestionClick?.(suggestion)
      submitQuery(suggestion)
    },
    [onSuggestionClick, submitQuery],
  )

  const hasMessages = messages.length > 0

  return (
    <div className={`${styles.panel} ${hasMessages ? styles.panelActive : ''}`}>

      {!hasMessages && (
        <div className={styles.introBlock}>
          <div className={styles.mascotWrap}>
            <Image src="/ai-advisor/mascot.png" alt="" fill sizes="160px" className={styles.mascot} unoptimized />
          </div>

          <div className={styles.textBlock}>
            <h1 className={styles.heading}>AI Domain Advisor</h1>
            <p className={styles.description}>
              Ask anything about your Web3 domains - get personalised advice, portfolio analysis, and monetisation strategies.
            </p>
          </div>
        </div>
      )}

      {hasMessages && (
        <div className={styles.thread} role="log" aria-live="polite" ref={threadRef} data-lenis-prevent>
          {messages.map(message => (
            <div
              key={message.id}
              className={`${styles.messageRow} ${message.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant}`}
            >
              {message.role === 'assistant' && (
                <div className={styles.messageAvatarWrap}>
                  <Image src="/ai-advisor/mascot.png" alt="" fill sizes="44px" className={styles.messageAvatarMascot} unoptimized />
                </div>
              )}

              <div className={styles.messageBubble}>{message.text}</div>

              {message.role === 'user' && (
                <span className={styles.messageAvatarUser} aria-hidden="true">
                  <FiUser size={16} />
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.interactionBlock}>

        <form className={styles.chatBox} onSubmit={handleSubmit} aria-label="Ask the AI advisor">
          <label htmlFor="ai-advisor-query" className={styles.srOnly}>Ask anything</label>
          <textarea
            id="ai-advisor-query"
            className={styles.chatInput}
            placeholder="Ask anything"
            value={query}
            onChange={handleChange}
            rows={1}
          />

          <div className={styles.chatBoxFooter}>
            <div className={styles.creditInfo}>
              <Image src="/ai-advisor/credit-icon.svg" alt="" width={18} height={18} className={styles.creditIcon} unoptimized />
              <span className={styles.creditCount}>{creditsUsed}/{MAX_CREDITS}</span>
              <span className={styles.creditLabel}>credit</span>
            </div>

            <button type="submit" className={styles.sendButton} aria-label="Send message" disabled={!query.trim()}>
              <FiArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </form>

        {!hasMessages && (
          <>
            <div className={styles.divider} aria-hidden="true" />

            <div className={styles.suggestions}>
              <p className={styles.suggestionsLabel}>Suggestions on what to ask Our AI</p>
              <div className={styles.suggestionsGrid}>
                {SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    className={styles.suggestionPill}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  )
}

export default AiAdvisorChatPanel
