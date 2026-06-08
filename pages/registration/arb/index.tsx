import React, { useState } from 'react'
import { MdOutlineReceiptLong } from 'react-icons/md'
import { PiTagLight, PiInfoLight } from 'react-icons/pi'
import { TbArrowRight, TbChevronDown, TbX } from 'react-icons/tb'

import RegistrationLeftSection from '@/design-system/composites/reg/RegistrationLeftSection'
import { PrimaryButton } from '@/design-system/primitives/button/PrimaryButton'
import { SecondaryButton } from '@/design-system/primitives/secondary-button/SecondaryButton'

import arbLogo from '../../../public/reg/arb.svg'
import styles from './arb.module.scss'

const MOCK_DOMAINS = [
  { id: '1', name: 'yjutffgfgygug.blockchain', price: '$0' },
  { id: '2', name: 'yjutffgfgygug.blockchain', price: '$0' },
  { id: '3', name: 'yjutffgfgygug.blockchain', price: '$0' },
]

const BILLING_ROWS = [
  { id: 'subtotal', label: 'Subtotal', icon: null, value: '$0' },
  { id: 'fees', label: 'Registration Fees', icon: <PiInfoLight aria-hidden="true" />, value: '$0' },
  { id: 'promo', label: 'Promo / Offer', icon: <PiTagLight aria-hidden="true" />, value: '$0' },
  { id: 'renewals', label: 'No Renewals Needed', icon: null, value: '$0' },
]

export default function ArbRegistrationPage() {
  const [orderOpen, setOrderOpen] = useState(true)
  const [discountCode, setDiscountCode] = useState('')

  return (
    <main className={styles.page}>
      <section className={styles.mainSection} aria-label="Registration checkout">
        <div className={styles.container}>

          {/* ── Left column ── */}
          <div className={styles.leftCol}>
            <RegistrationLeftSection
              chainName="Arbitrum"
              chainLogo={arbLogo}
              chainLogoWidth={44}
              chainLogoHeight={50}
              paymentLabel="Payments In ETH"
            />
          </div>

          {/* ── Right column ── */}
          <aside className={styles.rightCol} aria-label="Order summary">

            {/* Order Reviews */}
            <div className={styles.panel}>
              <button
                type="button"
                className={styles.panelHeader}
                aria-expanded={orderOpen}
                onClick={() => setOrderOpen(o => !o)}
              >
                <span className={styles.panelHeaderLeft}>
                  <MdOutlineReceiptLong className={styles.panelHeaderIcon} aria-hidden="true" />
                  <span className={styles.panelHeaderTitle}>Order Reviews</span>
                </span>
                <TbChevronDown
                  className={`${styles.panelChevron} ${orderOpen ? styles.panelChevronOpen : ''}`}
                  aria-hidden="true"
                />
              </button>
              <div className={styles.panelDivider} aria-hidden="true" />
              {orderOpen && (
                <ul className={styles.domainList}>
                  {MOCK_DOMAINS.map(domain => (
                    <li key={domain.id} className={styles.domainRow}>
                      <div className={styles.domainAvatar} aria-hidden="true">
                        <span className={styles.domainAvatarLetter}>u</span>
                      </div>
                      <span className={styles.domainName}>{domain.name}</span>
                      <span className={styles.domainPrice}>{domain.price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Billing Summary */}
            <div className={styles.panel}>
              <div className={styles.panelHeader} aria-hidden="false">
                <span className={styles.panelHeaderLeft}>
                  <MdOutlineReceiptLong className={styles.panelHeaderIcon} aria-hidden="true" />
                  <span className={styles.panelHeaderTitle}>Billing Summary</span>
                </span>
              </div>
              <div className={styles.panelDivider} aria-hidden="true" />

              <div className={styles.billingBody}>
                <div className={styles.discountRow}>
                  <button type="button" className={styles.discountToggle}>
                    Apply A Discount Code
                    <PiTagLight className={styles.discountTagIcon} aria-hidden="true" />
                  </button>
                  <div className={styles.discountInputWrap}>
                    <input
                      type="text"
                      className={styles.discountInput}
                      placeholder="enter discount code"
                      value={discountCode}
                      onChange={e => setDiscountCode(e.target.value)}
                      aria-label="Discount code"
                    />
                    <button type="button" className={styles.discountApplyBtn}>
                      Apply
                      {discountCode && (
                        <TbX
                          className={styles.discountClearIcon}
                          aria-hidden="true"
                          onClick={e => { e.stopPropagation(); setDiscountCode('') }}
                        />
                      )}
                    </button>
                  </div>
                </div>

                <div className={styles.billingDivider} aria-hidden="true" />

                <ul className={styles.billingRows}>
                  {BILLING_ROWS.map(row => (
                    <li key={row.id} className={styles.billingRow}>
                      <span className={styles.billingRowLabel}>
                        {row.label}
                        {row.icon && <span className={styles.billingRowLabelIcon}>{row.icon}</span>}
                      </span>
                      <span className={styles.billingRowValue}>{row.value}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.billingTotalDivider} aria-hidden="true" />

                <div className={styles.grandTotalRow}>
                  <span className={styles.grandTotalLabel}>Grand Total</span>
                  <span className={styles.grandTotalValue}>$0</span>
                </div>

                <PrimaryButton type="button" fullWidth icon={<TbArrowRight aria-hidden="true" />} iconPosition="right">
                  Proceed To Payments
                </PrimaryButton>

                <button type="button" className={styles.exploreMore}>
                  <span className={styles.exploreMoreChevron} aria-hidden="true">&#8249;</span>
                  Explore More Identities
                </button>
              </div>
            </div>

          </aside>

        </div>

        {/* Mobile bottom bar */}
        <div className={styles.mobileBottomBar}>
          <SecondaryButton type="button">
            Cancel Payment
          </SecondaryButton>
          <PrimaryButton
            type="button"
            icon={<TbArrowRight aria-hidden="true" />}
            iconPosition="right"
          >
            Register
          </PrimaryButton>
        </div>
      </section>
    </main>
  )
}
