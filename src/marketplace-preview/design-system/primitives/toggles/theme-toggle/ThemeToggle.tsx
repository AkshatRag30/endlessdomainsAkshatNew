import React from 'react'
import { useTheme } from '@/marketplace-preview/context/ThemeContext'
import styles from './ThemeToggle.module.scss'

export interface ThemeToggleProps {
  className?: string
}

// Figma node 93:54892 icons (fi_66275 sun, fi_702471 moon), rebuilt from the
// exported paths in one 12px viewBox and drawn in currentColor so each icon
// can swap colour with the knob instead of shipping light and dark files.
const SunIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className={styles.icon}>
    <path transform="translate(2.994 2.994)" d="M3.00558 0C1.34827 0 0 1.34854 0 3.00585C0 4.66315 1.34827 6.01169 3.00558 6.01169C4.66262 6.01169 6.01116 4.66342 6.01116 3.00585C6.01116 1.34827 4.66262 0 3.00558 0Z" />
    <path transform="translate(5.413 0)" d="M0.586448 2.11089C0.262533 2.11089 0 1.84836 0 1.52471V0.586448C0 0.262533 0.262533 0 0.586448 0C0.910363 0 1.1729 0.262533 1.1729 0.586448V1.52471C1.1729 1.84836 0.910098 2.11089 0.586448 2.11089Z" />
    <path transform="translate(5.413 9.889)" d="M0.586448 0C0.262533 0 0 0.262533 0 0.586448V1.52445C0 1.84863 0.262533 2.11116 0.586448 2.11116C0.910363 2.11116 1.1729 1.84863 1.1729 1.52445V0.586448C1.1729 0.262533 0.910098 0 0.586448 0Z" />
    <path transform="translate(8.578 1.585)" d="M0.17159 1.66442C-0.0571966 1.43536 -0.0571966 1.06415 0.17159 0.835097L0.835097 0.17159C1.06388 -0.0571966 1.43536 -0.0571966 1.66442 0.17159C1.89347 0.400642 1.89347 0.772121 1.66442 1.00091L1.00091 1.66442C0.772121 1.89347 0.400908 1.89347 0.17159 1.66442Z" />
    <path transform="translate(1.585 8.579)" d="M1.66452 0.171988C1.43546 -0.0573295 1.06425 -0.0573295 0.835197 0.171988L0.17169 0.83523C-0.057097 1.06402 -0.0573627 1.43576 0.17169 1.66455C0.400742 1.89334 0.772221 1.89334 1.00101 1.66455L1.66452 1.00077C1.89357 0.771988 1.89357 0.400509 1.66452 0.171988Z" />
    <path transform="translate(9.889 5.413)" d="M0 0.586448C0 0.262533 0.262533 0 0.586448 0H1.52471C1.84863 0 2.11116 0.262533 2.11116 0.586448C2.11116 0.910363 1.84863 1.17263 1.52471 1.17263H0.586448C0.262533 1.17263 0 0.910363 0 0.586448Z" />
    <path transform="translate(0 5.413)" d="M2.11089 0.586448C2.11089 0.262533 1.84836 0 1.52445 0H0.586448C0.262533 0 0 0.262533 0 0.586448C0 0.910363 0.262533 1.17263 0.586448 1.17263H1.52471C1.84836 1.17263 2.11089 0.910363 2.11089 0.586448Z" />
    <path transform="translate(8.578 8.579)" d="M0.171789 0.17159C0.400841 -0.0571966 0.77232 -0.0571966 1.00111 0.17159L1.66461 0.835097C1.89367 1.06362 1.89367 1.43536 1.66461 1.66415C1.43556 1.89294 1.06435 1.89294 0.835296 1.66415L0.171789 1.00064C-0.0572631 0.77159 -0.0572631 0.400376 0.171789 0.17159Z" />
    <path transform="translate(1.585 1.585)" d="M1.66461 1.66435C1.89367 1.4353 1.89367 1.06408 1.66461 0.835031L1.00111 0.171789C0.772055 -0.0572631 0.400841 -0.0572631 0.171789 0.171789C-0.0572631 0.400576 -0.0572631 0.772055 0.171789 1.00084L0.835297 1.66435C1.06435 1.89367 1.43556 1.89367 1.66461 1.66435Z" />
  </svg>
)

const MoonIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className={styles.icon}>
    <path transform="translate(2.005 2.003)" d="M8.61564 5.01092C8.5253 4.98834 8.43497 5.01092 8.35593 5.06738C8.06234 5.3158 7.72359 5.51905 7.35096 5.65455C7.00091 5.79005 6.61699 5.8578 6.21049 5.8578C5.29585 5.8578 4.46026 5.48517 3.86179 4.88671C3.26333 4.28824 2.8907 3.45265 2.8907 2.53802C2.8907 2.15409 2.95845 1.78147 3.07137 1.44271C3.19558 1.08137 3.37625 0.753912 3.61337 0.471618C3.715 0.347408 3.69242 0.166739 3.56821 0.0651131C3.48916 0.00865411 3.39883 -0.0139295 3.3085 0.00865411C2.34869 0.268365 1.5131 0.844247 0.914635 1.61209C0.338754 2.36864 0 3.30586 0 4.32212C0 5.55293 0.496839 6.67081 1.30985 7.48382C2.12286 8.29683 3.22945 8.79367 4.47155 8.79367C5.51039 8.79367 6.4702 8.43233 7.23804 7.83387C8.01717 7.22411 8.58176 6.35464 8.81889 5.36096C8.86406 5.20288 8.77372 5.04479 8.61564 5.01092Z" />
  </svg>
)

/**
 * Figma node 93:54892: 54x22 pill, knob over the sun in light and over the
 * moon in dark. Knob position and colours come from the theme attribute on
 * <html> (see the SCSS), not from React state, so a saved dark choice shows
 * the right position on first paint.
 */
export const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      className={[styles.toggle, className].filter(Boolean).join(' ')}
      onClick={toggleTheme}
    >
      <span className={styles.knob} aria-hidden="true" />
      <span className={`${styles.slot} ${styles.sun}`}>
        <SunIcon />
      </span>
      <span className={`${styles.slot} ${styles.moon}`}>
        <MoonIcon />
      </span>
    </button>
  )
}

export default ThemeToggle
