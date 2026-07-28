import styles from './SuggestionPills.module.scss'

const SUGGESTIONS = ['Get name idea', 'popular domain', 'short names', 'gaming']

interface SuggestionPillsProps {
  onSelect: (suggestion: string) => void
}

export function SuggestionPills({ onSelect }: SuggestionPillsProps) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Try:</span>
      <div className={styles.pills} role="list">
        {SUGGESTIONS.map(suggestion => (
          <button
            key={suggestion}
            type="button"
            role="listitem"
            className={styles.pill}
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SuggestionPills
