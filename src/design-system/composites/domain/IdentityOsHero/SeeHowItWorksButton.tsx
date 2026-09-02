import styles from './SeeHowItWorksButton.module.scss'

// Arrow glyph inlined from the exact Figma asset (Group, node 70:4665) — a diagonal
// stroke plus a corner bracket forming an arrow, rotated -90° per the design to point
// up-and-right.
function ArrowIcon() {
  return (
    <svg width="10.5" height="10.5" viewBox="0 0 10.5 10.5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0.71967 0.71972C1.01256 0.42682 1.48743 0.42682 1.78033 0.71972L10.2803 9.21974C10.5732 9.51264 10.5732 9.98744 10.2803 10.2803C9.98744 10.5732 9.51254 10.5732 9.21964 10.2803L0.71967 1.78038C0.42677 1.48748 0.42677 1.01261 0.71967 0.71972Z" fill="white" />
      <path d="M9.75004 0C10.1642 0 10.5 0.33578 10.5 0.75V9.75004C10.5 10.1642 10.1642 10.5 9.75004 10.5H0.75C0.33578 10.5 0 10.1642 0 9.75004C0 9.33574 0.33578 9.00004 0.75 9.00004H9.00004V0.75C9.00004 0.33578 9.33574 0 9.75004 0Z" fill="white" />
    </svg>
  )
}

function scrollToHowItWorks() {
  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
}

export function SeeHowItWorksButton() {
  return (
    <button type="button" className={styles.seeHowButton} onClick={scrollToHowItWorks}>
      <span className={styles.texture} aria-hidden="true" />
      <span className={styles.label}>
        see how it works
      </span>
      <span className={styles.iconWrap}>
        <ArrowIcon />
      </span>
    </button>
  )
}

export default SeeHowItWorksButton
