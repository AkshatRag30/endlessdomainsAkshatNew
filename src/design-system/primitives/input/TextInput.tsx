import React from 'react'
import styles from './TextInput.module.scss'

export interface TextInputProps {
  label?: string
  icon?: React.ReactNode
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  id?: string
  name?: string
  readOnly?: boolean
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  icon,
  placeholder,
  value,
  onChange,
  type = 'text',
  id,
  name,
  readOnly,
}) => (
  <div className={styles.wrapper}>
    {label && (
      <label className={styles.label} htmlFor={id}>
        {icon}
        {label}
      </label>
    )}
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={styles.input}
    />
  </div>
)

export default TextInput
