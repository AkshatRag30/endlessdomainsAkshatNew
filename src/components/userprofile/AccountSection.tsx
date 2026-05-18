import React, { useState } from 'react'
import { FiMail, FiPhone, FiUser } from 'react-icons/fi'
import { FaTelegram, FaTelegramPlane, FaUserCircle } from 'react-icons/fa'
import { SectionCard } from '@/design-system/primitives/display/SectionCard'
import { TextInput } from '@/design-system/primitives/input/TextInput'
import { PhoneInputField } from '@/design-system/primitives/input/PhoneInputField'
import { VerifyBadge } from '@/design-system/primitives/input/VerifyBadge'
import styles from './AccountSection.module.scss'
import { MdEmail } from 'react-icons/md'
import { IoMdCall } from 'react-icons/io'

export const AccountSection: React.FC = () => {
  const [fullName, setFullName] = useState('jayendless')
  const [email, setEmail] = useState('Jay.Doe@Example.com')
  const [phone, setPhone] = useState('+91 111-111-1111')
  const [telegram, setTelegram] = useState('telegram ID')
  const [emailVerified] = useState(false)

  return (
    <SectionCard title="Account">
      <div className={styles.fields}>
        <div className={styles.field}>
          <TextInput
            id="fullName"
            label="Full Name"
            icon={<FaUserCircle size={18} />}
            placeholder="Full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.emailWrapper}>
            <label className={styles.fieldLabel} htmlFor="email">
              <MdEmail size={18} />
              Email
            </label>
            <div className={styles.emailInputRow}>
              <input
                id="email"
                type="email"
                className={styles.emailInput}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
              />
              <VerifyBadge onVerify={() => {}} verified={emailVerified} />
            </div>
          </div>
        </div>

        <div className={`${styles.field} ${styles.fieldPhone}`}>
          <PhoneInputField
            id="phone"
            label="Mobile Number"
            icon={<IoMdCall size={18} />}
            phoneNumber={phone}
            countryCode="+91"
            flagSrc="/flags/in.svg"
            onChange={setPhone}
          />
        </div>

        <div className={styles.field}>
          <TextInput
            id="telegram"
            label="Telegram"
            icon={<FaTelegram size={18} />}
            placeholder="Telegram ID"
            value={telegram}
            onChange={e => setTelegram(e.target.value)}
          />
        </div>
      </div>
    </SectionCard>
  )
}

export default AccountSection
