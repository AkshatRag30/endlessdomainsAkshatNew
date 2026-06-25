import { useRef, useState } from 'react'
import Image from 'next/image'
import { FaLinkedin } from 'react-icons/fa'
import { useEntranceAnimation } from '../useEntranceAnimation'
import styles from './TeamSection.module.scss'

function TrapezoidSVG() {
  return (
    <div className={styles.trapezoidWrap} aria-hidden="true">
      <Image src="/about-us/Group 2085666414.svg" alt="" width={763} height={200} className={styles.trapezoidImg} />
    </div>
  )
}

// ── Founder data ──────────────────────────────────────────────────────────────

const FOUNDERS = [
  {
    id: 'vicky',
    name: 'Vicky Hissaria',
    title: 'FOUNDER AND CEO',
    imageUrl: '/about-us/vicky.jpg',
    linkedin: 'https://linkedin.com/in/vicky-hissaria-02517a93',
    align: 'right' as const,
    bio: [
      'Born and raised in India, eighteen years across China and Hong Kong, the last five in Dubai. A democracy, a communist state, a monarchy. Three systems. Three completely different answers to who holds power, who owns what, and who decides. Most people spend their entire lives inside one. He has built businesses inside all three.',
      'He has been in this space since 2013. Crypto mining in Iceland. CFD trading. Crypto investments. He did not watch this industry grow. He built inside it.',
      'Endless Domains is where all of it lands. We started before the OS existed, before the market arrived, before most people knew what on-chain identity could become. Every identity claimed is proof the conviction was right.',
    ],
  },
  {
    id: 'ankit',
    name: 'Ankit Agarwal',
    title: 'CO-FOUNDER',
    imageUrl: '/about-us/ankit.jpg',
    linkedin: 'https://linkedin.com/in/ankit-agarwal-endless-domains',
    align: 'left' as const,
    photoTop: true,
    bio: [
      'Digital identity is evolving beyond usernames and social profiles into true ownership layers. We are building the infrastructure that enables domains to become programmable identities powering wallets, payments, reputation, communities, and digital experiences across multiple blockchains. As the internet shifts toward user ownership and interoperability, domains will serve as the foundation connecting people, applications, and assets in a seamless way. Endless Domains is not simply naming the next generation of the internet—we are building the identity layer that helps power its operating system, making Web3 more accessible, connected, and scalable for everyone.',
    ],
  },
]

// ── Core team cards ───────────────────────────────────────────────────────────

const CORE_TEAM = [
  { id: 'himanshu', name: 'Himanshu Sachan', title: 'Web3 Marketing',           imageUrl: '/about-us/himanshu.jpg', linkedin: 'https://www.linkedin.com/in/sachanh/' },
  { id: 'pallavi',  name: 'Pallavi Patodia', title: 'Head Of Ecosystem Partnerships', imageUrl: '/about-us/pallavi.jpg',  linkedin: 'https://www.linkedin.com/in/pallavi-patodia-6764a51ba/' },
  { id: 'mohit',    name: 'Mohit Agarwal',   title: 'Project Manager',         imageUrl: '/about-us/mohit.jpg',    linkedin: 'https://www.linkedin.com/in/moagrw/' },
]

// ── Team member cards ─────────────────────────────────────────────────────────

const TEAM_MEMBERS = [
  { id: 'smriti',   name: 'Smriti Singh',       title: 'Frontend Developer',        imageUrl: '/about-us/smriti.jpg',    linkedin: 'https://www.linkedin.com/in/smriti-singh0710/' },
  { id: 'akshat',   name: 'Akshat Rag',         title: 'Junior Frontend Developer', imageUrl: '/about-us/akshat.jpg',    linkedin: 'https://www.linkedin.com/in/akshatrag/' },
  { id: 'jay',      name: 'Khamgoulun Haokip',  title: 'UI/UX Designer',            imageUrl: '/about-us/jay.jpg',       linkedin: 'https://www.linkedin.com/in/khamgoulun-haokip' },
  { id: 'bhavuk',   name: 'Bhavuk Kathuria',    title: 'Graphics Designer',         imageUrl: '/about-us/bhavuk.jpg',    linkedin: 'https://www.linkedin.com/in/bhavuk-kathuria-0a1512291/' },
  { id: 'shresth',  name: 'Shresth Singh',      title: 'Video Editor',              imageUrl: '/about-us/shresth.jpg',   linkedin: 'https://www.linkedin.com/in/shresth-singh-2abbb4249/' },
  { id: 'rahul',    name: 'Rahul Sodhi',        title: 'Social Media Manager',      imageUrl: '/about-us/rahul.jpg',     linkedin: 'https://www.linkedin.com/in/rahul-sodhi-performance-marketer/' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function TeamSection() {
  const [activeTab, setActiveTab] = useState<'core' | 'team'>('core')
  const visibleMembers = activeTab === 'core' ? CORE_TEAM : TEAM_MEMBERS

  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const founder1Ref = useRef<HTMLDivElement>(null)
  const founder2Ref = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEntranceAnimation([eyebrowRef, headingRef, descRef, founder1Ref, founder2Ref, tabsRef, cardsRef])

  return (
    <section className={styles.section} aria-labelledby="team-heading">

      {/* ── Top trapezoid decoration with group SVG stuck to top ── */}
      <div className={styles.topPolygon} aria-hidden="true">
        <div className={styles.topPolygonInner} />
        <Image src="/about-us/Group 2085666414.svg" alt="" width={763} height={200} className={styles.headerGroupSvg} />
      </div>

      {/* ── Section header ── */}
      <div className={styles.header}>

        <div className={styles.eyebrow} ref={eyebrowRef}>
          <span className={styles.eyebrowBracketTL} aria-hidden="true" />
          <span className={styles.eyebrowBracketTR} aria-hidden="true" />
          <span className={styles.eyebrowText}>LEADERSHIP &amp; TEAM</span>
          <span className={styles.eyebrowBracketBL} aria-hidden="true" />
          <span className={styles.eyebrowBracketBR} aria-hidden="true" />
        </div>

        <h2 id="team-heading" className={styles.heading} ref={headingRef}>
          The People Behind The Protocol.
        </h2>

        <p className={styles.desc} ref={descRef}>
          Endless Domains was not built by people who arrived when the market peaked. It was built
          by a team that saw what on-chain identity could become and started building the OS four
          years before most people knew what to call it.
        </p>

      </div>

      {/* ── Dashed separator after header ── */}
      <div className={styles.dashedLine} aria-hidden="true" />

      {/* ── Founder rows ── */}
      <div className={styles.founders}>

        {FOUNDERS.map((founder, idx) => (
          <div key={founder.id}>
            <div
              ref={idx === 0 ? founder1Ref : founder2Ref}
              className={`${styles.founderRow} ${founder.align === 'left' ? styles.founderRowLeft : ''}`}
            >
              {/* Text side */}
              <div className={`${styles.founderText} ${founder.align === 'left' ? styles.founderTextLeft : styles.founderTextRight}`}>
                <div className={styles.founderInfo}>
                  <div className={styles.founderNameRow}>
                    <p className={styles.founderName}>{founder.name}</p>
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.founderLinkedin}
                      aria-label={`${founder.name} on LinkedIn`}
                    >
                      <FaLinkedin aria-hidden="true" />
                    </a>
                  </div>
                  <p className={styles.founderTitle}>{founder.title}</p>
                </div>
                {founder.bio.map((para, i) => (
                  <p key={i} className={styles.founderBio}>{para}</p>
                ))}
              </div>

              {/* Photo side */}
              <div className={styles.founderPhotoWrap}>
                <Image
                  src={founder.imageUrl}
                  alt={founder.name}
                  width={294}
                  height={261}
                  className={`${styles.founderPhoto} ${founder.photoTop ? styles.founderPhotoTop : ''}`}
                  unoptimized
                  priority
                />
              </div>
            </div>

            {/* Dashed separator below each founder */}
            <div className={styles.dashedLine} aria-hidden="true" />
          </div>
        ))}

      </div>

      {/* ── SVG trapezoid decoration above tab switcher ── */}
      <div className={styles.midPolygon} aria-hidden="true">
        <TrapezoidSVG />
      </div>

      {/* ── Tab switcher ── */}
      <div className={styles.tabsWrap} ref={tabsRef}>
        <div className={styles.tabs} role="tablist" aria-label="Team view">

          {/* Core Team tab */}
          <button role="tab" aria-selected={activeTab === 'core'} className={styles.tab} onClick={() => setActiveTab('core')}>
            {activeTab === 'core' ? (
              // design-specific: active pill — blue filled trapezoid SVG
              <svg className={styles.tabBg} viewBox="0 0 148 47" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="none">
                <path d="M14 1H134C140.627 1 146 6.37258 146 13V34C146 40.6274 140.627 46 134 46H14C7.37258 46 2 40.6274 2 34V13C2 6.37258 7.37258 1 14 1Z" fill="#2639ED" fillOpacity="0.08" stroke="#2639ED" strokeWidth="1.2"/>
                <path d="M8 23.5L17 10H131L140 23.5L131 37H17L8 23.5Z" fill="#2639ED" fillOpacity="0.04"/>
              </svg>
            ) : (
              // design-specific: inactive pill — gray outline trapezoid SVG
              <svg className={styles.tabBg} viewBox="0 0 148 47" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="none">
                <path d="M14 1H134C140.627 1 146 6.37258 146 13V34C146 40.6274 140.627 46 134 46H14C7.37258 46 2 40.6274 2 34V13C2 6.37258 7.37258 1 14 1Z" fill="white" fillOpacity="0.04" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
              </svg>
            )}
            <span className={`${styles.tabLabel} ${activeTab === 'core' ? styles.tabLabelActive : ''}`}>Core Team</span>
          </button>

          {/* Team tab */}
          <button role="tab" aria-selected={activeTab === 'team'} className={styles.tab} onClick={() => setActiveTab('team')}>
            {activeTab === 'team' ? (
              <svg className={styles.tabBg} viewBox="0 0 148 47" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="none">
                <path d="M14 1H134C140.627 1 146 6.37258 146 13V34C146 40.6274 140.627 46 134 46H14C7.37258 46 2 40.6274 2 34V13C2 6.37258 7.37258 1 14 1Z" fill="#2639ED" fillOpacity="0.08" stroke="#2639ED" strokeWidth="1.2"/>
                <path d="M8 23.5L17 10H131L140 23.5L131 37H17L8 23.5Z" fill="#2639ED" fillOpacity="0.04"/>
              </svg>
            ) : (
              <svg className={styles.tabBg} viewBox="0 0 148 47" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="none">
                <path d="M14 1H134C140.627 1 146 6.37258 146 13V34C146 40.6274 140.627 46 134 46H14C7.37258 46 2 40.6274 2 34V13C2 6.37258 7.37258 1 14 1Z" fill="white" fillOpacity="0.04" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
              </svg>
            )}
            <span className={`${styles.tabLabel} ${activeTab === 'team' ? styles.tabLabelActive : ''}`}>Team</span>
          </button>

        </div>
      </div>

      {/* ── Team grid ── */}
      <div className={styles.teamGrid} ref={cardsRef} role="tabpanel" aria-label="Team members">
        {visibleMembers.map(member => (
          <div key={member.id} className={styles.card}>
            {/* Blue corner brackets */}
            <span className={styles.cardBracketTL} aria-hidden="true" />
            <span className={styles.cardBracketTR} aria-hidden="true" />
            <span className={styles.cardBracketBL} aria-hidden="true" />
            <span className={styles.cardBracketBR} aria-hidden="true" />

            <div className={styles.cardPhotoWrap}>
              <Image
                src={member.imageUrl}
                alt={member.name}
                width={225}
                height={181}
                className={styles.cardPhoto}
                unoptimized
              />
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkedinBadge}
                aria-label={`${member.name} on LinkedIn`}
              >
                <FaLinkedin aria-hidden="true" />
              </a>
              <div className={styles.cardGradient} aria-hidden="true" />
              <div className={styles.cardInfo}>
                <p className={styles.cardName}>{member.name}</p>
                <p className={styles.cardTitle}>{member.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom polygon decoration ── */}
      <div className={styles.bottomPolygon} aria-hidden="true">
        <div className={styles.bottomPolygonInner} />
      </div>

    </section>
  )
}
