import React from 'react'
import styles from './PhoneInputField.module.scss'

export interface PhoneInputFieldProps {
  label?: string
  icon?: React.ReactNode
  countryCode?: string
  phoneNumber?: string
  flagSrc?: string
  onChange?: (value: string) => void
  id?: string
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  label,
  icon,
  countryCode = '+91',
  phoneNumber = '',
  flagSrc,
  onChange,
  id,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {icon}
          {label}
        </label>
      )}
      <div className={styles.row}>
        <div className={styles.countrySelector} aria-label="Select country code">
          {flagSrc && <img src={flagSrc} alt="Country flag" className={styles.flag} />}
          <span className={styles.code}>{countryCode}</span>
          <svg
            className={styles.caret}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <input
          id={id}
          type="tel"
          value={phoneNumber}
          onChange={handleChange}
          className={styles.input}
          placeholder="Phone number"
        />
      </div>
    </div>
  )
}

export default PhoneInputField
