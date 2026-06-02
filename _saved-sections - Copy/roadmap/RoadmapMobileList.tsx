import { MILESTONES } from './RoadmapCheckpoints'
import styles from './Roadmap.module.scss'

export default function RoadmapMobileList() {
  return (
    <div className={styles.mobileList}>
      {MILESTONES.map((m, i) => (
        <div key={i} className={styles.mobileItem}>
          <span className={styles.yearBadge}>{m.year}</span>
          <h3 className={styles.milestoneTitle}>{m.title}</h3>
          <p className={styles.milestoneDesc}>{m.description}</p>
          <div className={styles.tags}>
            {m.tags.map((tag, ti) => (
              <span key={ti} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
