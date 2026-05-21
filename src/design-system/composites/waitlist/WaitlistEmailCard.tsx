import React, { useCallback, useState } from 'react'
import type { IconType } from 'react-icons'
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronDown,
} from 'react-icons/fi'
import { SiBitcoin, SiEthereum, SiSolana, SiBinance } from 'react-icons/si'
import PrimaryButton from '@/design-system/primitives/button'
import styles from './WaitlistEmailCard.module.scss'

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4

export interface WaitlistEmailCardProps {
  onComplete?: () => void
}

interface ChainOption {
  id: string
  label: string
  Icon: IconType
}

// ── Static data ────────────────────────────────────────────────────────────────

const CHAINS: ChainOption[] = [
  { id: 'btc', label: 'Bitcoin', Icon: SiBitcoin },
  { id: 'eth', label: 'Ethereum', Icon: SiEthereum },
  { id: 'sol', label: 'Solana', Icon: SiSolana },
  { id: 'bnb', label: 'BNB Chain', Icon: SiBinance },
]

const STEP_LABELS = ['Step 1', 'Step 2', 'Step 3', 'Step 4'] as const

const DEMO_REFERRAL = 'ED-A7K2-X9PQ'
const DEMO_WALLET = '0x5CE1F1093FD5CfDE31f23b50d27F604426842D98'
const BASE_POINTS = 50
const REFERRAL_POINTS = 100

// ── Sub-components ─────────────────────────────────────────────────────────────

function StepBar({ current }: { current: Step }) {
  return (
    <div className={styles.stepBar}>
      <nav className={styles.stepsRow} aria-label="Registration steps">
        {STEP_LABELS.map((label, i) => {
          const n = (i + 1) as Step
          const isActive = current >= n
          return (
            <React.Fragment key={label}>
              <div
                className={`${styles.stepPill} ${isActive ? styles.stepPillActive : ''}`}
                aria-current={current === n ? 'step' : undefined}
              >
                {label}
              </div>
              {i < 3 && (
                <div
                  className={`${styles.connHoriz} ${current > n ? styles.connHorizActive : ''}`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          )
        })}
      </nav>
    </div>
  )
}

function ConnectorTicks() {
  return (
    <div className={styles.connTicks} aria-hidden="true">
      <div className={styles.connTick} />
      <div className={styles.connTick} />
      <div className={styles.connTick} />
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function WaitlistEmailCard({ onComplete }: WaitlistEmailCardProps) {
  const [step, setStep] = useState<Step>(1)
  const [submitted, setSubmitted] = useState(false)

  const [email, setEmail] = useState('')
  const [selectedChain, setSelectedChain] = useState<ChainOption>(CHAINS[0])
  const [chainOpen, setChainOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [referralCode, setReferralCode] = useState('')

  const isValidReferral = referralCode === DEMO_REFERRAL
  const displayWallet = walletAddress || DEMO_WALLET
  const shortWallet = `${displayWallet.slice(0, 6)}...${displayWallet.slice(-4)}`
  const totalPoints = BASE_POINTS + (isValidReferral ? REFERRAL_POINTS : 0)

  const goNext = useCallback(() => setStep(s => (s < 4 ? (s + 1) as Step : s)), [])
  const goBack = useCallback(() => setStep(s => (s > 1 ? (s - 1) as Step : s)), [])
  const goTo = useCallback((n: Step) => setStep(n), [])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    onComplete?.()
  }, [onComplete])

  const toggleChain = useCallback(() => setChainOpen(o => !o), [])
  const pickChain = useCallback((c: ChainOption) => {
    setSelectedChain(c)
    setChainOpen(false)
  }, [])

  const ChainIcon = selectedChain.Icon

  return (
    <article className={styles.wrapper} aria-label="Join the waitlist form">
      <StepBar current={step} />
      <ConnectorTicks />

      <div className={styles.card}>

        {/* ── Success state (post-submit) ───────────────────────────── */}
        {submitted && (
          <div className={styles.body}>
            <div className={styles.successState}>
              <div className={styles.successIconWrap} aria-hidden="true">
                <FiCheck />
              </div>
              <h3 className={styles.heading}>You&apos;re In The OS.</h3>
              <p className={styles.hint}>
                Scroll down to see the leaderboard and your position.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 1: Email ─────────────────────────────────────────── */}
        {!submitted && step === 1 && (
          <div className={styles.body}>
            <h3 className={styles.heading}>Claim Your Place In The OS</h3>

            <div className={styles.fieldGroup}>
              <label htmlFor="wl-email" className={styles.fieldLabel}>Email</label>
              <input
                id="wl-email"
                type="email"
                className={styles.textInput}
                placeholder="satoshi@endless.io"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <p className={styles.hint}>Enter your email to begin a rewarding journey.</p>
            </div>

            <PrimaryButton type="button" fullWidth icon={<FiArrowRight />} iconPosition="right" onClick={goNext}>
              Continue
            </PrimaryButton>
          </div>
        )}

        {/* ── Step 2: Wallet ────────────────────────────────────────── */}
        {!submitted && step === 2 && (
          <div className={styles.body}>
            <h3 className={styles.heading}>Link Your On-Chain Identity</h3>

            <div className={styles.fieldGroup}>
              <p className={styles.fieldLabel} id="chain-label">Select Chain</p>
              <div
                className={`${styles.chainDropdown} ${chainOpen ? styles.chainDropdownOpen : ''}`}
                aria-labelledby="chain-label"
              >
                <button
                  type="button"
                  className={styles.chainTrigger}
                  onClick={toggleChain}
                  aria-expanded={chainOpen}
                  aria-haspopup="listbox"
                  aria-label={`Selected chain: ${selectedChain.label}`}
                >
                  <span data-chain={selectedChain.id} className={styles.chainIconWrap} aria-hidden="true">
                    <ChainIcon />
                  </span>
                  <span className={styles.chainLabel}>{selectedChain.label}</span>
                  <FiChevronDown className={styles.chainChevron} aria-hidden="true" />
                </button>

                <ul className={styles.chainOptions} role="listbox" aria-label="Select blockchain">
                  {CHAINS.map(c => {
                    const OptionIcon = c.Icon
                    return (
                      <li
                        key={c.id}
                        role="option"
                        aria-selected={c.id === selectedChain.id}
                        className={`${styles.chainOption} ${c.id === selectedChain.id ? styles.chainOptionActive : ''}`}
                        onClick={() => pickChain(c)}
                      >
                        <span data-chain={c.id} className={styles.chainIconWrap} aria-hidden="true">
                          <OptionIcon />
                        </span>
                        {c.label}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            <button type="button" className={styles.walletConnectBtn}>
              Connect With Wallet
            </button>

            <p className={styles.dividerText} aria-hidden="true">— or paste address manually —</p>

            <div className={styles.fieldGroup}>
              <input
                id="wl-wallet"
                type="text"
                className={`${styles.textInput} ${styles.textInputDark}`}
                placeholder={DEMO_WALLET}
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)}
                spellCheck={false}
                aria-label="Wallet address"
              />
              <p className={styles.hint}>
                Connect your first wallet. The OS starts reading your history immediately. Add more wallets any time.
              </p>
            </div>

            <PrimaryButton type="button" fullWidth icon={<FiArrowRight />} iconPosition="right" onClick={goNext}>
              Continue
            </PrimaryButton>
            <button type="button" className={styles.backBtn} onClick={goBack}>
              <FiArrowLeft aria-hidden="true" />
              Back
            </button>
          </div>
        )}

        {/* ── Step 3: Referral ──────────────────────────────────────── */}
        {!submitted && step === 3 && (
          <div className={styles.body}>
            <div className={styles.skipRow}>
              <button type="button" className={styles.skipBtn} onClick={goNext}>
                Skip This Step <FiArrowRight aria-hidden="true" />
              </button>
            </div>

            <h3 className={styles.heading}>
              Referral Code{' '}
              <span className={styles.optional}>(Optional)</span>
            </h3>

            <div className={styles.fieldGroup}>
              <label htmlFor="wl-referral" className={styles.fieldLabel}>Code</label>
              <input
                id="wl-referral"
                type="text"
                className={`${styles.textInput} ${isValidReferral ? styles.textInputValid : ''}`}
                placeholder="ED-XXXX-XXXX"
                value={referralCode}
                onChange={e => setReferralCode(e.target.value.toUpperCase())}
              />
              {isValidReferral && (
                <div className={styles.successBanner} role="status" aria-live="polite">
                  <FiCheck aria-hidden="true" />
                  <p>Valid Referral Code · Your Referrer Earns 100 Points.</p>
                </div>
              )}
            </div>

            <p className={styles.hint}>
              Enter before submitting. Every person you bring into the OS earns you 100 points. The OS remembers who was here first.
            </p>

            <PrimaryButton type="button" fullWidth icon={<FiArrowRight />} iconPosition="right" onClick={goNext}>
              Continue
            </PrimaryButton>
            <button type="button" className={styles.backBtn} onClick={goBack}>
              <FiArrowLeft aria-hidden="true" />
              Back
            </button>
          </div>
        )}

        {/* ── Step 4: Confirm ───────────────────────────────────────── */}
        {!submitted && step === 4 && (
          <div className={styles.body}>
            <h3 className={styles.heading}>Confirm Your Registration</h3>

            <dl className={styles.reviewTable}>
              <div className={styles.reviewRow}>
                <dt className={styles.reviewLabel}>Email</dt>
                <dd className={styles.reviewValue}>{email || 'satoshi@endless.io'}</dd>
                <button type="button" className={styles.reviewEdit} onClick={() => goTo(1)}>
                  Edit ↗
                </button>
              </div>

              <div className={styles.reviewRow}>
                <dt className={styles.reviewLabel}>Wallet</dt>
                <dd className={styles.reviewValue}>
                  {shortWallet}{' '}
                  <span data-chain={selectedChain.id} className={`${styles.chainIconWrap} ${styles.chainIconWrapSm}`} aria-hidden="true">
                    <ChainIcon />
                  </span>{' '}
                  {selectedChain.label.slice(0, 3).toUpperCase()}
                </dd>
                <button type="button" className={styles.reviewEdit} onClick={() => goTo(2)}>
                  Edit ↗
                </button>
              </div>

              <div className={styles.reviewRow}>
                <dt className={styles.reviewLabel}>Ref Code</dt>
                <dd className={`${styles.reviewValue} ${isValidReferral ? styles.reviewValueGreen : ''}`}>
                  {referralCode || '—'}
                  {isValidReferral && (
                    <>{' '}(verify) <FiCheck className={styles.verifyCheck} aria-hidden="true" /></>
                  )}
                </dd>
                <button type="button" className={styles.reviewEdit} onClick={() => goTo(3)}>
                  Edit ↗
                </button>
              </div>
            </dl>

            <div className={styles.pointsBanner} aria-label={`${totalPoints} points credited on registration`}>
              <p className={styles.pointsLabel}>Points Credited On Registration</p>
              <p className={styles.pointsValue}>+{totalPoints} Pts</p>
            </div>

            <p className={styles.legalText}>
              By registering, you agree to the Endless Domains Terms of Service. Your score is already waiting in your wallet history.
            </p>

            <PrimaryButton type="button" fullWidth icon={<FiArrowRight />} iconPosition="right" onClick={handleSubmit}>
              Enter The OS
            </PrimaryButton>
            <button type="button" className={styles.backBtn} onClick={goBack}>
              <FiArrowLeft aria-hidden="true" />
              Back
            </button>
          </div>
        )}

      </div>
    </article>
  )
}

export default WaitlistEmailCard
