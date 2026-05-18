import React, { useMemo } from 'react'
import styles from './PasswordStrengthMeter.module.scss'

export interface PasswordStrengthMeterProps {
  password: string
}

type StrengthLevel = 0 | 1 | 2 | 3 | 4

const LABELS: Record<StrengthLevel, string> = {
  0: '',
  1: 'Very Weak',
  2: 'Weak',
  3: 'Fair',
  4: 'Strong',
}

function getStrength(password: string): StrengthLevel {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4) as StrengthLevel
}

const barClass: Record<number, string> = {
  1: styles.bar_red,
  2: styles.bar_orange,
  3: styles.bar_yellow,
  4: styles.bar_green,
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const strength = useMemo(() => getStrength(password), [password])

  return (
    <div className={styles.wrapper}>
      <div className={styles.bars} role="progressbar" aria-valuenow={strength} aria-valuemin={0} aria-valuemax={4} aria-label="Password strength">
        {([1, 2, 3, 4] as const).map(i => (
          <div
            key={i}
            className={`${styles.bar} ${i <= strength ? barClass[strength] : styles.bar_empty}`}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className={styles.label}>{LABELS[strength]}</p>
      )}
    </div>
  )
}

export default PasswordStrengthMeter
