import { useRef } from 'react'
import { PerksNavBar } from '@/design-system/composites/reputation/perks/PerksNavBar/PerksNavBar'
import { Hero } from '@/design-system/composites/about-us/Hero'
import { AboutSection } from '@/design-system/composites/about-us/AboutSection'
import { MissionSection } from '@/design-system/composites/about-us/MissionSection'
import { StorySection } from '@/design-system/composites/about-us/StorySection'
import { TeamSection } from '@/design-system/composites/about-us/TeamSection'
import { ExecutionSection } from '@/design-system/composites/about-us/ExecutionSection'
import { EcosystemExpansion } from '@/design-system/composites/about-us/EcosystemExpansion'
import { SiteFooter } from '@/components/userprofile/SiteFooter'
import { useScrollParallax } from '@/design-system/composites/about-us/useScrollParallax'
import styles from './about-us.module.scss'

export default function AboutUsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)

  useScrollParallax({ hero: heroRef, about: aboutRef })

  return (
    <div className={styles.shell}>
      <PerksNavBar onGoldClick={() => {}} goldButtonVariant="gold" />
      <main className={styles.mainArea}>
        <div ref={heroRef} className={styles.parallaxLayer}>
          <Hero />
        </div>
        <div ref={aboutRef} className={styles.parallaxAbove}>
          <AboutSection />
          <MissionSection />
          <StorySection />
          <TeamSection />
          <ExecutionSection />
          <EcosystemExpansion />
          <SiteFooter />
        </div>
      </main>
    </div>
  )
}
