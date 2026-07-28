import styles from './AiModeToggleSwitch.module.scss'

interface AiModeToggleSwitchProps {
  isOpen: boolean
}

// Flat CSS recreation of the Figma "Group 2085666044" toggle spec — blue track with an
// inset white glow, a white knob-track pill, and a gray sliding knob with layered shadows.
export function AiModeToggleSwitch({ isOpen }: AiModeToggleSwitchProps) {
  return (
    <div className={styles.track}>
      <span className={styles.knobBg} />
      <span className={`${styles.knob} ${isOpen ? styles.knobOn : ''}`} />
    </div>
  )
}

export default AiModeToggleSwitch
