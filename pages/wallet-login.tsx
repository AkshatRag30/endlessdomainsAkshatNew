import type { NextPage } from 'next'
import LoginLeftSection from '@/design-system/composites/auth/login_left_section'
import LoginRightSection from '@/components/login_right_section/LoginRightSection'
import styles from './wallet-login.module.scss'

const WalletLoginPage: NextPage = () => (
  <div className={styles.page}>
    <div className={styles.leftPanel}>
      <LoginLeftSection />
    </div>
    <div className={styles.rightPanel}>
      <LoginRightSection
        logoSrc="/wallet-login/right_side_assets/endlesslogo.svg"
      />
    </div>
  </div>
)

export default WalletLoginPage
