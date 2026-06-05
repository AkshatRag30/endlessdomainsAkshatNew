import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { BsExclamationCircle } from 'react-icons/bs'
import { MdClose, MdCheck, MdContentCopy } from 'react-icons/md'
import { getProviderLogo } from '@/helpers/chaincurrency/chaincurrency'
import ReputationModal from './ReputationModal'
import DisableModal from './DisableModal'
import styles from './AccountSettings.module.scss'

const DEMO_EVM_ADDRESS = '0x723FE05c...30446DfEdD'

const ChevronDown = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function AccountSettings() {
  const [trackingOn, setTrackingOn] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [disableModalOpen, setDisableModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [solanaInput, setSolanaInput] = useState('')
  const [solanaInput2, setSolanaInput2] = useState('')
  const [solanaInput3, setSolanaInput3] = useState('')

  useEffect(() => { setMounted(true) }, [])

  const handleToggle = useCallback(() => {
    if (trackingOn) {
      setDisableModalOpen(true)
    } else {
      setTrackingOn(true)
    }
  }, [trackingOn])

  const handleConfirmDisable = useCallback(() => {
    setTrackingOn(false)
    setDisableModalOpen(false)
  }, [])

  const closeDisableModal = useCallback(() => setDisableModalOpen(false), [])
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])
  const handleEnable = useCallback(() => setTrackingOn(true), [])
  const handleSolanaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSolanaInput(e.target.value), [])
  const handleSolanaChange2 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSolanaInput2(e.target.value), [])
  const handleSolanaChange3 = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSolanaInput3(e.target.value), [])

  return (
    <div className={styles.root}>

      {/* ── Top card: Primary Domain + Reputation Tracking ─────────── */}
      <div className={styles.topCard}>
        <div className={styles.grid}>

          {/* Primary Domain */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Primary Domain</p>

            <div className={styles.fieldRow}>
              <div className={styles.domainDisplay}>
                <div className={styles.domainProviderIcon}>
                  <Image src={getProviderLogo('UD')!} alt="Unstoppable Domains" width={29} height={29} />
                </div>
                <span className={styles.domainName}>myname.og</span>
                <span className={styles.primaryBadge}>Primary</span>
              </div>
              <button type="button" className={styles.changeBtn} onClick={openModal} aria-label="Change primary domain">
                <span>Change</span>
                <ChevronDown />
              </button>
            </div>

            <div className={styles.warningRow}>
              <BsExclamationCircle className={styles.warningIcon} aria-hidden="true" />
              <p className={styles.warningText}>
                Reputation is attached to your primary domain. Changing it doesn't transfer your score — each domain has its own history.
              </p>
            </div>
          </div>

          {/* Reputation Tracking */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Reputation Tracking</p>

            <div className={styles.fieldRow}>
              <span className={styles.trackingLabel}>Score, tiers, and perk eligibility</span>
              <div className={styles.toggleGroup}>
                <span className={styles.toggleHint}>Off</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={trackingOn}
                  aria-label="Toggle reputation tracking"
                  className={`${styles.toggle} ${trackingOn ? styles.toggleOn : ''}`}
                  onClick={handleToggle}
                >
                  <MdClose className={styles.toggleIconX} aria-hidden="true" />
                  <MdCheck className={styles.toggleIconCheck} aria-hidden="true" />
                  <span className={styles.toggleThumb} />
                </button>
                <span className={styles.toggleHint}>On</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Wallets card ─────────────────────────────────────────────── */}
      <div className={styles.walletsCard}>
        <div className={styles.walletsHead}>
          <h2 className={styles.walletsTitle}>Wallets</h2>
          <p className={styles.walletsSubtitle}>Link the wallet addresses you want to receive payments on.</p>
        </div>

        {/* EVM Wallet */}
        <div className={styles.walletBlock}>
          <div className={styles.walletBlockHeader}>
            <div className={styles.walletChainIcon} data-chain="evm">
              <Image src="/domain/ethereum.svg" alt="" width={13} height={21} aria-hidden="true" unoptimized />
            </div>
            <span className={styles.walletBlockTitle}>Connect With Evm Wallet</span>
          </div>
          <div className={styles.walletRow}>
            <span className={styles.walletAddress}>{DEMO_EVM_ADDRESS}</span>
            <button type="button" className={styles.copyBtn} aria-label="Copy wallet address">
              <MdContentCopy />
            </button>
          </div>
        </div>

        {/* Solana Wallet */}
        <div className={styles.walletBlock}>
          <div className={styles.walletBlockHeader}>
            <div className={styles.walletChainIcon} data-chain="solana">
              <Image src="/domain/sol.png" alt="" width={22} height={22} aria-hidden="true" unoptimized />
            </div>
            <span className={styles.walletBlockTitle}>Connect With Solana</span>
          </div>
          <div className={styles.walletRow}>
            <input
              type="text"
              className={styles.walletInput}
              placeholder="Wallet Address"
              value={solanaInput}
              onChange={handleSolanaChange}
              aria-label="Solana wallet address"
            />
            <button type="button" className={styles.addWalletBtn}>
              Add Solana Wallet
            </button>
          </div>
        </div>

        {/* Solana Wallet 2 */}
        <div className={styles.walletBlock}>
          <div className={styles.walletBlockHeader}>
            <div className={styles.walletChainIcon} data-chain="solana">
              <Image src="/domain/sol.png" alt="" width={22} height={22} aria-hidden="true" unoptimized />
            </div>
            <span className={styles.walletBlockTitle}>Connect With Solana</span>
          </div>
          <div className={styles.walletRow}>
            <input
              type="text"
              className={styles.walletInput}
              placeholder="Wallet Address"
              value={solanaInput2}
              onChange={handleSolanaChange2}
              aria-label="Solana wallet address 2"
            />
            <button type="button" className={styles.addWalletBtn}>
              Add Solana Wallet
            </button>
          </div>
        </div>

        {/* Solana Wallet 3 */}
        <div className={styles.walletBlock}>
          <div className={styles.walletBlockHeader}>
            <div className={styles.walletChainIcon} data-chain="solana">
              <Image src="/domain/sol.png" alt="" width={22} height={22} aria-hidden="true" unoptimized />
            </div>
            <span className={styles.walletBlockTitle}>Connect With Solana</span>
          </div>
          <div className={styles.walletRow}>
            <input
              type="text"
              className={styles.walletInput}
              placeholder="Wallet Address"
              value={solanaInput3}
              onChange={handleSolanaChange3}
              aria-label="Solana wallet address 3"
            />
            <button type="button" className={styles.addWalletBtn}>
              Add Solana Wallet
            </button>
          </div>
        </div>

      </div>

      {mounted && modalOpen && createPortal(
        <ReputationModal onClose={closeModal} onEnable={handleEnable} />,
        document.body,
      )}

      {mounted && disableModalOpen && createPortal(
        <DisableModal onConfirm={handleConfirmDisable} onClose={closeDisableModal} />,
        document.body,
      )}
    </div>
  )
}
