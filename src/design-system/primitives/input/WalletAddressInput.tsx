import React from 'react'
import styles from './WalletAddressInput.module.scss'

export interface WalletAddressInputProps {
  placeholder?: string
  value?: string
  buttonLabel: string
  walletIconSrc?: string
  onAdd: () => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const WalletAddressInput: React.FC<WalletAddressInputProps> = ({
  placeholder = 'Wallet address',
  value = '',
  buttonLabel,
  walletIconSrc,
  onAdd,
  onChange,
}) => (
  <div className={styles.wrapper}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.input}
    />
    <button type="button" className={styles.addBtn} onClick={onAdd} aria-label={buttonLabel}>
      {walletIconSrc && <img src={walletIconSrc} alt="" aria-hidden="true" className={styles.walletIcon} />}
      <span>{buttonLabel}</span>
    </button>
  </div>
)

export default WalletAddressInput
