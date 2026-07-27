import { useCallback, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import {
  VerifyingOnChainModal,
  CollectionCreatedModal,
  SignatureCancelledModal,
  NetworkUnavailableModal,
  TransactionFailedOnChainModal,
  AlreadyRecordedModal,
} from '@/design-system/composites/gm/GmCreateNftModals'
import styles from './create-nft-modals-demo.module.scss'

type ModalKey =
  | 'verifying'
  | 'created'
  | 'cancelled'
  | 'network'
  | 'failed'
  | 'recorded'
  | null

const DEMO_TX_HASH = '0x723FE05c...30446DfEdD'

const CreateNftModalsDemoPage: NextPage = () => {
  const [openModal, setOpenModal] = useState<ModalKey>(null)

  const closeModal = useCallback(() => setOpenModal(null), [])

  return (
    <>
      <Head>
        <title>Create NFT Modals Demo — Endless Domains</title>
        <meta name="description" content="Preview area for the create NFT and deploy contract status modals." />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Create NFT / Deploy Contract Modals</h1>
        <p className={styles.subtitle}>
          Preview only — these buttons are not wired into the main create NFT or deploy contract pages.
        </p>

        <div className={styles.grid}>
          <PrimaryButton type="button" shape="rounded" onClick={() => setOpenModal('verifying')}>
            Verifying On-Chain
          </PrimaryButton>
          <PrimaryButton type="button" shape="rounded" onClick={() => setOpenModal('created')}>
            Collection Created
          </PrimaryButton>
          <PrimaryButton type="button" shape="rounded" onClick={() => setOpenModal('cancelled')}>
            Signature Cancelled
          </PrimaryButton>
          <PrimaryButton type="button" shape="rounded" onClick={() => setOpenModal('network')}>
            Network Unavailable
          </PrimaryButton>
          <PrimaryButton type="button" shape="rounded" onClick={() => setOpenModal('failed')}>
            Transaction Failed
          </PrimaryButton>
          <PrimaryButton type="button" shape="rounded" onClick={() => setOpenModal('recorded')}>
            Already Recorded
          </PrimaryButton>
        </div>
      </main>

      {openModal === 'verifying' && (
        <VerifyingOnChainModal txHash={DEMO_TX_HASH} onClose={closeModal} />
      )}

      {openModal === 'created' && (
        <CollectionCreatedModal
          txHash={DEMO_TX_HASH}
          onClose={closeModal}
          onCreateAnother={closeModal}
          onViewCollection={closeModal}
        />
      )}

      {openModal === 'cancelled' && (
        <SignatureCancelledModal onClose={closeModal} onBackToPreviews={closeModal} />
      )}

      {openModal === 'network' && (
        <NetworkUnavailableModal chainName="Base" onClose={closeModal} onChangeChain={closeModal} onTryAgain={closeModal} />
      )}

      {openModal === 'failed' && (
        <TransactionFailedOnChainModal txHash={DEMO_TX_HASH} onClose={closeModal} onTryAgain={closeModal} />
      )}

      {openModal === 'recorded' && (
        <AlreadyRecordedModal
          collectionName="Neon Cats"
          chainName="Base"
          txHash={DEMO_TX_HASH}
          onClose={closeModal}
          onViewCollection={closeModal}
        />
      )}
    </>
  )
}

export default CreateNftModalsDemoPage
