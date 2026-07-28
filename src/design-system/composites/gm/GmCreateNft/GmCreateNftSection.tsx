import { useCallback, useState } from 'react'
import { GmCreateNftStep1Collection } from './GmCreateNftStep1Collection'
import { GmCreateNftStep2Token } from './GmCreateNftStep2Token'
import { GmCreateNftStep3Review } from './GmCreateNftStep3Review'
import { GmCreateNftConfirmModal } from './GmCreateNftConfirmModal'
import { GmCreateNftSuccessModal } from './GmCreateNftSuccessModal'
import { GmCreateNftFormState, INITIAL_CREATE_NFT_FORM } from './gmCreateNft.data'
import { createMockTxHash } from '../gm.data'
import styles from './GmCreateNftSection.module.scss'

type FlowStep = 1 | 2 | 3

const STEP_META: Record<FlowStep, { title: string; description: string }> = {
  1: { title: 'Configure Your Collection', description: 'Your collection details are permanently written to the blockchain on deploy.' },
  2: { title: 'Configure Your Token', description: 'Standard: ERC-20 - these fields become part of the deployed contract.' },
  3: { title: 'Review & Deploy', description: 'Confirm the details below — this action cannot be undone once submitted.' },
}

export function GmCreateNftSection() {
  const [step, setStep] = useState<FlowStep>(1)
  const [form, setForm] = useState<GmCreateNftFormState>(INITIAL_CREATE_NFT_FORM)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [txHash, setTxHash] = useState('')

  const updateForm = useCallback((patch: Partial<GmCreateNftFormState>) => {
    setForm(prev => ({ ...prev, ...patch }))
  }, [])

  const goToStep2 = useCallback(() => setStep(2), [])
  const goToStep3 = useCallback(() => setStep(3), [])
  const backToStep1 = useCallback(() => setStep(1), [])
  const backToStep2 = useCallback(() => setStep(2), [])

  const handleCreate = useCallback(() => {
    setIsConfirming(true)
    // Simulate wallet signature + on-chain deploy — replace with real contract call
    window.setTimeout(() => {
      setIsConfirming(false)
      setTxHash(createMockTxHash())
      setIsSuccess(true)
    }, 2200)
  }, [])

  const handleCloseConfirm = useCallback(() => setIsConfirming(false), [])

  const handleCloseSuccess = useCallback(() => {
    setIsSuccess(false)
    setStep(1)
    setForm(INITIAL_CREATE_NFT_FORM)
  }, [])

  const meta = STEP_META[step]

  return (
    <section className={styles.section} aria-labelledby="create-nft-heading">
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.cardBackground} aria-hidden="true" />

        <div className={styles.cardHeader}>
          <h2 id="create-nft-heading" className={styles.title}>{meta.title}</h2>
          <p className={styles.description}>{meta.description}</p>
        </div>

        <div className={styles.stepIndicator} role="list" aria-label="Creation steps">
          {[1, 2, 3].map(n => (
            <div key={n} role="listitem" className={styles.stepDotWrap}>
              <span
                className={`${styles.stepDot} ${step === n ? styles.stepDotActive : ''} ${step > n ? styles.stepDotDone : ''}`}
                aria-current={step === n ? 'step' : undefined}
              >
                {n}
              </span>
              {n < 3 && <span className={styles.stepConnector} aria-hidden="true" />}
            </div>
          ))}
        </div>

        <div className={styles.stepContent}>
          {step === 1 && (
            <GmCreateNftStep1Collection form={form} onChange={updateForm} onContinue={goToStep2} />
          )}

          {step === 2 && (
            <GmCreateNftStep2Token form={form} onChange={updateForm} onBack={backToStep1} onContinue={goToStep3} />
          )}

          {step === 3 && (
            <GmCreateNftStep3Review form={form} onBack={backToStep2} onCreate={handleCreate} />
          )}
        </div>
      </div>

      {isConfirming && <GmCreateNftConfirmModal onClose={handleCloseConfirm} />}
      {isSuccess && <GmCreateNftSuccessModal form={form} txHash={txHash} onClose={handleCloseSuccess} />}
    </section>
  )
}

export default GmCreateNftSection
