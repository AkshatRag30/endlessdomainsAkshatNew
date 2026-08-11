import type { ChangeEvent } from 'react'

import styles from './UrlField.module.scss'

interface UrlFieldProps {
  id: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  prefix?: string
}

export default function UrlField({ id, label, value, onChange, placeholder = 'www.example.com', prefix = 'http://' }: UrlFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputRow}>
        <span className={styles.prefix} aria-hidden="true">
          {prefix}
        </span>
        <span className={styles.divider} aria-hidden="true" />
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
        />
      </div>
    </div>
  )
}
