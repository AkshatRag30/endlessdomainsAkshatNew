import React from 'react'
import styles from './AuthRecoveryForm.module.scss'

/*
 * Figma 25:16733 ("Find Your Account", forgot password): a 445px column
 * with one labelled field, 29px above the submit button. Presentational
 * only: value, onChange, error, disabled and submit stay with the page.
 */

export const AuthRecoveryForm = ({ onSubmit, children }: { onSubmit: React.FormEventHandler<HTMLFormElement>; children: React.ReactNode }) => (
  <form onSubmit={onSubmit} className={styles.form}>
    {children}
  </form>
)

export interface AuthRecoveryFieldProps {
  id: string
  label: string
  name: string
  type: 'email'
  placeholder: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  /** Shown under the field when set (the page decides when). */
  error?: string
  autoComplete?: string
}

/** Figma 25:16737: 14px label, 4px gap, a square 1px #ded2d9 box. */
export const AuthRecoveryField = ({ id, label, name, type, placeholder, value, onChange, error, autoComplete }: AuthRecoveryFieldProps) => {
  const errorId = `${id}-error`
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={error ? `${styles.input} ${styles.inputError}` : styles.input}
      />
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default AuthRecoveryForm
