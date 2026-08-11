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
  /** Set false for contexts (e.g. modal forms) whose Figma spec calls for a medium-weight label instead of bold */
  boldLabel?: boolean
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
  boldLabel = true,
}) => (
  <div className={styles.wrapper}>
    {label && (
      <label className={`${styles.label} ${boldLabel ? '' : styles.labelMedium}`} htmlFor={id}>
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
