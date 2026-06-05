import { useCallback, useState } from 'react'
import Image from 'next/image'
import { HiArrowRight, HiChevronDown } from 'react-icons/hi'
import { RxCross2 } from 'react-icons/rx'
import { getProviderLogo, DomainProviderKey } from '@/helpers/chaincurrency/chaincurrency'
import styles from './ReputationModal.module.scss'

// ── Types ──────────────────────────────────────────────────────────────────────

type ModalStep = 'enable' | 'choose' | 'tracking'

interface Domain {
  name: string
  provider: DomainProviderKey
}

// ── Demo data (replace with real wallet domains on integration) ────────────────

const DEMO_DOMAINS: Domain[] = [
  { name: 'myname.ud', provider: 'UD' },
  { name: 'myname.ud', provider: 'UD' },
  { name: 'myname.ud', provider: 'UD' },
]

// ── Provider icon circle ───────────────────────────────────────────────────────

const ProviderIcon = ({ provider, size = 28 }: { provider: DomainProviderKey; size?: number }) => {
  const logo = getProviderLogo(provider)
  return (
    <div className={styles.providerCircle} data-provider={provider}>
      {logo && <Image src={logo} alt={provider} width={size} height={size} />}
    </div>
  )
}

// ── Clip-path variables (matches PrimaryButton primitive) ─────────────────────

// ── Step 1: Enable Reputation ─────────────────────────────────────────────────

interface Step1Props {
  domains: Domain[]
  selectedIndex: number
  onSelectIndex: (i: number) => void
  onNext: () => void
  onClose: () => void
}

const StepEnable = ({ domains, selectedIndex, onSelectIndex, onNext, onClose }: Step1Props) => {
  const [dropOpen, setDropOpen] = useState(false)
  const toggleDrop = useCallback(() => setDropOpen(v => !v), [])
  const selected = domains[selectedIndex]

  const handleSelect = useCallback((i: number) => {
    onSelectIndex(i)
    setDropOpen(false)
  }, [onSelectIndex])

  return (
    <div className={styles.card}>
      <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
        <RxCross2 size={12} aria-hidden="true" />
      </button>

      <h2 className={styles.title}>Enable Reputation</h2>

      <div className={styles.step1Body}>
        <div className={styles.dropdownWrap}>
          <button
            type="button"
            className={styles.dropdownTrigger}
            onClick={toggleDrop}
            aria-expanded={dropOpen}
            aria-haspopup="listbox"
          >
            <div className={styles.dropdownLeft}>
              <ProviderIcon provider={selected.provider} size={22} />
              <span className={styles.dropdownDomainName}>{selected.name}</span>
            </div>
            <HiChevronDown size={10} aria-hidden="true" />
          </button>

          {dropOpen && (
            <ul className={styles.dropdownList} role="listbox" aria-label="Select domain">
              {domains.map((d, i) => (
                <li
                  key={i}
                  role="option"
                  aria-selected={selectedIndex === i}
                  className={`${styles.dropdownItem} ${selectedIndex === i ? styles.dropdownItemActive : ''}`}
                  onClick={() => handleSelect(i)}
                >
                  <ProviderIcon provider={d.provider} size={20} />
                  <span className={styles.dropdownItemName}>{d.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className={styles.step1Hint}>will be your primary domain</p>

        <button type="button" className={styles.primaryBtn} onClick={onNext} aria-label="Search Domains">
          <span>Search Domains</span>
          <HiArrowRight size={18} color="white" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

// ── Step 2: Choose Primary Domain ─────────────────────────────────────────────

interface Step2Props {
  domains: Domain[]
  selectedIndex: number
  onSelectIndex: (i: number) => void
  onNext: () => void
  onClose: () => void
}

const StepChoose = ({ domains, selectedIndex, onSelectIndex, onNext, onClose }: Step2Props) => (
  <div className={styles.card}>
    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
      <RxCross2 size={12} aria-hidden="true" />
    </button>

    <h2 className={styles.title}>Choose Your Primary Domain</h2>
    <p className={styles.subtitle}>Reputation is tied to one domain. Pick yours.</p>

    <ul className={styles.domainList} role="listbox" aria-label="Choose primary domain">
      {domains.map((d, i) => (
        <li
          key={i}
          role="option"
          aria-selected={selectedIndex === i}
          className={`${styles.domainRow} ${selectedIndex === i ? styles.domainRowSelected : ''}`}
          onClick={() => onSelectIndex(i)}
        >
          <div className={`${styles.radioCircle} ${selectedIndex === i ? styles.radioCircleSelected : ''}`} aria-hidden="true">
            {selectedIndex === i && <div className={styles.radioDot} />}
          </div>
          <ProviderIcon provider={d.provider} size={22} />
          <span className={styles.domainRowName}>{d.name}</span>
        </li>
      ))}
    </ul>

    <button type="button" className={styles.primaryBtn} onClick={onNext} aria-label="Continue">
      <span>Continue</span>
      <HiArrowRight size={18} color="white" aria-hidden="true" />
    </button>
  </div>
)

// ── Step 3: Enable Reputation Tracking ────────────────────────────────────────

interface Step3Props {
  onConfirm: () => void
  onClose: () => void
}

const FEATURES = [
  { emoji: '🏆', label: 'Tier badges' },
  { emoji: '🎁', label: 'Exclusive perks' },
  { emoji: '🔥', label: 'GM streaks' },
  { emoji: '📊', label: 'Score tracking' },
]

const PRIVACY = [
  { emoji: '🔒', text: 'No personal data collected', color: 'green' as const },
  { emoji: '👁', text: 'Wallet addresses never displayed', color: 'orange' as const },
  { emoji: '•', text: 'Opt out anytime from settings', color: 'blue' as const },
]

const StepTracking = ({ onConfirm, onClose }: Step3Props) => (
  <div className={`${styles.card} `}>

    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
      <RxCross2 size={12} aria-hidden="true" />
    </button>

    <h2 className={styles.title}>Enable Reputation Tracking</h2>
    <p className={styles.subtitle}>Reputation is tied to one domain. Pick yours.</p>

    {/* Feature highlights */}
    <div className={styles.featuresBox}>
      {FEATURES.map(f => (
        <div key={f.label} className={styles.featureItem}>
          <span className={styles.featureEmoji} aria-hidden="true">{f.emoji}</span>
          <span className={styles.featureLabel}>{f.label}</span>
        </div>
      ))}
    </div>

    {/* Privacy list */}
    <ul className={styles.privacyList}>
      {PRIVACY.map(p => (
        <li key={p.text} className={styles.privacyItem} data-color={p.color}>
          <span className={styles.privacyIcon} aria-hidden="true">{p.emoji}</span>
          <span className={styles.privacyText}>{p.text}</span>
        </li>
      ))}
    </ul>

    {/* Action row */}
    <div className={styles.actionRow}>
      <button type="button" className={styles.cancelBtn} onClick={onClose} aria-label="Cancel">
        <span className={styles.cancelLabel}>Cancel</span>
        <span className={styles.corner} aria-hidden="true" />
      </button>
      <button type="button" className={styles.primaryBtn} onClick={onConfirm} aria-label="Enable">
        <span>Enable</span>
      </button>
    </div>
  </div>
)

// ── ReputationModal root ───────────────────────────────────────────────────────

export interface ReputationModalProps {
  onClose: () => void
  onEnable?: () => void
}

export default function ReputationModal({ onClose, onEnable }: ReputationModalProps) {
  const [step, setStep] = useState<ModalStep>('enable')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleSelectIndex = useCallback((i: number) => setSelectedIndex(i), [])
  const goChoose = useCallback(() => setStep('choose'), [])
  const goTracking = useCallback(() => setStep('tracking'), [])
  const handleConfirm = useCallback(() => { onEnable?.(); onClose() }, [onEnable, onClose])

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Reputation setup"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {step === 'enable' && (
        <StepEnable
          domains={DEMO_DOMAINS}
          selectedIndex={selectedIndex}
          onSelectIndex={handleSelectIndex}
          onNext={goChoose}
          onClose={onClose}
        />
      )}
      {step === 'choose' && (
        <StepChoose
          domains={DEMO_DOMAINS}
          selectedIndex={selectedIndex}
          onSelectIndex={handleSelectIndex}
          onNext={goTracking}
          onClose={onClose}
        />
      )}
      {step === 'tracking' && (
        <StepTracking onConfirm={handleConfirm} onClose={onClose} />
      )}
    </div>
  )
}
