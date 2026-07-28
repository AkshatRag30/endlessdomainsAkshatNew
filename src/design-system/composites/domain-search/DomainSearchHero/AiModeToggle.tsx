import { HiSparkles } from 'react-icons/hi2'
import { AiModeToggleSwitch } from './AiModeToggleSwitch'
import styles from './AiModeToggle.module.scss'

interface AiModeToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function AiModeToggle({ checked, onChange }: AiModeToggleProps) {
  return (
    <div className={styles.wrap}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="Toggle AI search"
        className={styles.track}
        onClick={() => onChange(!checked)}
      >
        <AiModeToggleSwitch isOpen={checked} />
      </button>
      <span className={styles.label}>
        <HiSparkles size={18} aria-hidden="true" className={styles.sparkle} />
        Ai Search
      </span>
    </div>
  )
}

export default AiModeToggle
