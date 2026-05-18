import React, { useState } from 'react'
import { PiLockKeyFill } from 'react-icons/pi'
import { SectionCard } from '@/design-system/primitives/display/SectionCard'
import { PasswordInput } from '@/design-system/primitives/input/PasswordInput'
import { PasswordStrengthMeter } from '@/design-system/primitives/input/PasswordStrengthMeter'
import styles from './ChangePasswordSection.module.scss'

export const ChangePasswordSection: React.FC = () => {
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  return (
    <SectionCard title="Change Password">
      <div className={styles.fields}>
        <div className={styles.field}>
          <PasswordInput
            id="oldPassword"
            label="Old Password"
            icon={<PiLockKeyFill />}
            placeholder="*****************"
            value={oldPwd}
            onChange={e => setOldPwd(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <PasswordInput
            id="newPassword"
            label="Create New Password"
            icon={<PiLockKeyFill />}
            placeholder="*****************"
            value={newPwd}
            onChange={e => setNewPwd(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            icon={<PiLockKeyFill />}
            placeholder="*****************"
            value={confirmPwd}
            onChange={e => setConfirmPwd(e.target.value)}
          />
          <div className={styles.strengthMeter}>
            <PasswordStrengthMeter password={confirmPwd} />
          </div>
        </div>
      </div>

    </SectionCard>
  )
}

export default ChangePasswordSection
