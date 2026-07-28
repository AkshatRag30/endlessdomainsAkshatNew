import { useCallback, useState } from 'react'
import { GmCreateNftConfirmModal } from '../GmCreateNft/GmCreateNftConfirmModal'
import { GmDeployContractStep1Template } from './GmDeployContractStep1Template'
import { GmDeployContractStep2Token } from './GmDeployContractStep2Token'
import { GmDeployContractStep3Review } from './GmDeployContractStep3Review'
import { GmDeployContractSuccessModal } from './GmDeployContractSuccessModal'
import { DeployContractTemplateId, DeployTokenFormState, INITIAL_DEPLOY_TOKEN_FORM } from './gmDeployContract.data'
import { createMockTxHash } from '../gm.data'
import styles from './GmDeployContractSection.module.scss'

type FlowStep = 1 | 2 | 3

export function GmDeployContractSection() {
  const [step, setStep] = useState<FlowStep>(1)
  const [selectedId, setSelectedId] = useState<DeployContractTemplateId | null>(null)
  const [tokenForm, setTokenForm] = useState<DeployTokenFormState>(INITIAL_DEPLOY_TOKEN_FORM)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [txHash, setTxHash] = useState('')

  const handleSelect = useCallback((id: DeployContractTemplateId, comingSoon?: boolean) => {
    if (comingSoon) return
    setSelectedId(id)
  }, [])

  const updateTokenForm = useCallback((patch: Partial<DeployTokenFormState>) => {
    setTokenForm(prev => ({ ...prev, ...patch }))
  }, [])

  const goToStep2 = useCallback(() => {
    if (!selectedId) return
    setStep(2)
  }, [selectedId])

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
    setSelectedId(null)
    setTokenForm(INITIAL_DEPLOY_TOKEN_FORM)
  }, [])

  return (
    <section className={styles.section} aria-labelledby="deploy-contract-heading">
      <div className={styles.glow} aria-hidden="true" />

      {step === 1 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 id="deploy-contract-heading" className={`${styles.title} ${styles.titleAccent}`}>What Do You Want To Deploy?</h2>
            <p className={styles.description}>Pick a template. Each one deploys an audited, unmodified contract — no code required.</p>
          </div>

          <GmDeployContractStep1Template selectedId={selectedId} onSelect={handleSelect} onContinue={goToStep2} />
        </div>
      )}

      {(step === 2 || step === 3) && (
        <div className={styles.tokenCard}>
          <div className={styles.tokenCardBackground} aria-hidden="true" />

          <div className={styles.cardHeader}>
            <h2 id="deploy-contract-heading" className={`${styles.title} ${styles.titleAccent}`}>Configure Your Token</h2>
            <p className={styles.description}>Standard: ERC-20 - these fields become part of the deployed contract.</p>
          </div>

          <div className={styles.tokenStepContent}>
            {step === 2 && (
              <GmDeployContractStep2Token
                form={tokenForm}
                onChange={updateTokenForm}
                onBack={backToStep1}
                onContinue={goToStep3}
              />
            )}

            {step === 3 && (
              <GmDeployContractStep3Review form={tokenForm} onBack={backToStep2} onCreate={handleCreate} />
            )}
          </div>
        </div>
      )}

      {isConfirming && <GmCreateNftConfirmModal onClose={handleCloseConfirm} />}
      {isSuccess && <GmDeployContractSuccessModal form={tokenForm} txHash={txHash} onClose={handleCloseSuccess} />}
    </section>
  )
}

export default GmDeployContractSection
