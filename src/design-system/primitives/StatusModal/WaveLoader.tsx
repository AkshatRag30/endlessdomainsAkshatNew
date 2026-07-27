import { useId } from 'react'
import styles from './StatusModalParts.module.scss'

// Animated wave loader SVG — same visual as ScoreLoading, sized for the
// StatusModal icon circle (38px).
export function WaveLoader() {
  const maskId = useId()

  return (
    <svg className={styles.waveSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="21.6471" cy="21.6471" r="20.2941" stroke="white" strokeWidth="2.70588" />
      <mask id={maskId}>
        <circle cx="21.6471" cy="21.6471" r="16.2353" fill="white" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <g className={styles.waveBack}>
          <path
            d="M-44 24 C-33 18 -22 18 -11 24 C0 30 11 30 22 24 C33 18 44 18 55 24 C66 30 77 30 88 24 V60 H-44 Z"
            fill="white"
            opacity={0.35}
          />
        </g>
        <g className={styles.waveFront}>
          <path
            d="M-44 26 C-33 20 -22 20 -11 26 C0 32 11 32 22 26 C33 20 44 20 55 26 C66 32 77 32 88 26 V60 H-44 Z"
            fill="white"
          />
        </g>
      </g>
    </svg>
  )
}

export default WaveLoader
