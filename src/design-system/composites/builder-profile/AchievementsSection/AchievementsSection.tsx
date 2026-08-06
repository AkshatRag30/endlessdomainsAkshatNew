import type { BuilderAchievement } from '../types'
import styles from './AchievementsSection.module.scss'

interface AchievementsSectionProps {
  achievements: BuilderAchievement[]
  subtitle: string
  onShowMore?: () => void
  showMoreVisible?: boolean
}

export default function AchievementsSection({ achievements, subtitle, onShowMore, showMoreVisible = true }: AchievementsSectionProps) {
  return (
    <section className={styles.section} aria-labelledby="builder-achievements-heading">
      <h2 id="builder-achievements-heading" className={styles.heading}>
        Achievements
      </h2>
      <p className={styles.subtitle}>{subtitle}</p>

      <div className={styles.grid}>
        {achievements.map(achievement => (
          <div key={achievement.id} className={styles.card}>
            <div className={styles.cardInner}>
              <h3 className={styles.cardTitle}>{achievement.title}</h3>
              <p className={styles.cardSubtitle}>{achievement.subtitle}</p>
              <span className={styles.badge}>{achievement.badgeLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {showMoreVisible && (
        <button type="button" className={styles.showMoreBtn} onClick={onShowMore}>
          Show more
        </button>
      )}
    </section>
  )
}
