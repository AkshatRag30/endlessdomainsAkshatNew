import React, { useState } from 'react'
import Link from 'next/link'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import styles from './AuthEmailFields.module.scss'

/*
 * The Email tab's form pieces. Figma only draws the Web3 Wallet tab, so
 * these follow the webui AuthPage form (label over input, show / hide
 * password, Remember me + Forgot Password) sized to this page's 461px
 * buttons. All of them are presentational: value, onChange, errors and
 * submit stay with the page's existing handlers.
 */

/** The email form's column: 461px wide like the provider buttons, 16px between fields. */
export const AuthEmailForm = ({ onSubmit, children }: { onSubmit: React.FormEventHandler<HTMLFormElement>; children: React.ReactNode }) => (
  <form onSubmit={onSubmit} className={styles.form}>
    {children}
  </form>
)

export interface AuthTextFieldProps {
  id: string
  label: string
  name: string
  type: 'email' | 'password'
  placeholder: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  /** Shown under the field when set (the page decides when). */
  error?: string
  autoComplete?: string
}

export const AuthTextField = ({ id, label, name, type, placeholder, value, onChange, error, autoComplete }: AuthTextFieldProps) => {
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const errorId = `${id}-error`

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input
          id={id}
          name={name}
          type={isPassword && revealed ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={error ? `${styles.input} ${styles.inputError}` : styles.input}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.reveal}
            onClick={() => setRevealed((prev) => !prev)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
          >
            {revealed ? <FiEyeOff size={16} aria-hidden="true" /> : <FiEye size={16} aria-hidden="true" />}
          </button>
        )}
      </div>
      {error && (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

/** "Remember me" + "Forgot Password?". The checkbox stays uncontrolled, as on the old page. */
export const AuthRememberRow = ({ checkboxId }: { checkboxId: string }) => (
  <div className={styles.rememberRow}>
    <label className={styles.remember} htmlFor={checkboxId}>
      <input type="checkbox" id={checkboxId} className={styles.checkbox} />
      Remember me
    </label>
    <Link href="/forgot-password" className={styles.forgot}>
      Forgot Password?
    </Link>
  </div>
)

/** "or" between the Google button and the email form. */
export const AuthDivider = () => (
  <div className={styles.divider} role="separator">
    <span>or</span>
  </div>
)
