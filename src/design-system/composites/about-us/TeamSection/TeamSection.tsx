import { useRef, useState } from 'react'
import Image from 'next/image'
import { FaLinkedin } from 'react-icons/fa'
import { useEntranceAnimation } from '../useEntranceAnimation'
import styles from './TeamSection.module.scss'

// Base SVG as <Image> + two bar SVGs inlined so CSS animation works
function TrapezoidSVG() {
  return (
    <div className={styles.trapezoidWrap} aria-hidden="true">
      {/* Vector 6 — blue inner bar, top */}
      <svg className={`${styles.trapezoidBar} ${styles.trapezoidBarBlue}`} width="570" height="60" viewBox="0 0 570 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M524.012 31.0892L542.04 6.18155C545.895 0.85603 552.777 -1.3241 558.995 0.810979C568.478 4.06723 572.125 15.555 566.258 23.685L547.487 49.6929C543.058 55.8293 535.982 59.46 528.451 59.46H40.6391C33.1081 59.46 26.0319 55.8293 21.6031 49.6929L2.83265 23.685C-3.03499 15.5549 0.612378 4.06723 10.0952 0.810972C16.3129 -1.32411 23.1957 0.856041 27.0503 6.18157L45.0782 31.0892C49.5086 37.2103 56.5756 40.8302 64.0953 40.8302H504.995C512.515 40.8302 519.582 37.2103 524.012 31.0892Z" fill="url(#v6_grad_top)" fillOpacity="0.07"/>
        <defs>
          <linearGradient id="v6_grad_top" x1="-8.955" y1="28.34" x2="578.045" y2="28.34" gradientUnits="userSpaceOnUse">
            <stop offset="0.073" stopColor="#2639ED" stopOpacity="0"/>
            <stop offset="0.21" stopColor="#2639ED"/>
            <stop offset="0.805" stopColor="#2639ED"/>
            <stop offset="0.94" stopColor="#2639ED" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
      {/* Vector 5 — white glowing bar, bottom */}
      <svg className={`${styles.trapezoidBar} ${styles.trapezoidBarWhite}`} width="718" height="112" viewBox="0 0 718 112" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#v5_filter)" style={{ mixBlendMode: 'plus-lighter' }}>
          <path d="M643.714 57.1381L665.191 27.6848C669.765 21.412 677.888 18.8446 685.236 21.3493C696.538 25.2016 700.877 38.8985 693.855 48.5562L671.642 79.1073C666.373 86.3538 657.955 90.6413 648.995 90.6413H68.6579C59.6984 90.6413 51.28 86.3538 46.0112 79.1073L23.798 48.5561C16.7761 38.8985 21.1155 25.2016 32.4175 21.3493C39.7657 18.8446 47.8887 21.412 52.4626 27.6848L73.9389 57.1381C79.2097 64.3666 87.6171 68.6413 96.5631 68.6413H621.09C630.036 68.6413 638.444 64.3666 643.714 57.1381Z" fill="url(#v5_grad)" fillOpacity="0.2"/>
        </g>
        <defs>
          <filter id="v5_filter" x="0" y="0" width="717.653" height="111.041" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="10.2" result="blur"/>
            <feTurbulence type="fractalNoise" baseFrequency="0.27027 0.43478" stitchTiles="stitch" numOctaves="3" result="noise" seed="4246"/>
            <feComponentTransfer in="noise" result="coloredNoise">
              <feFuncR type="linear" slope="2" intercept="-0.5"/>
              <feFuncG type="linear" slope="2" intercept="-0.5"/>
              <feFuncB type="linear" slope="2" intercept="-0.5"/>
              <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"/>
            </feComponentTransfer>
            <feComposite operator="in" in2="blur" in="coloredNoise" result="noiseClipped"/>
            <feComponentTransfer in="noiseClipped" result="color1">
              <feFuncA type="table" tableValues="0 0.23"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="color1"/>
            </feMerge>
          </filter>
          <linearGradient id="v5_grad" x1="9.657" y1="53.89" x2="707.996" y2="53.89" gradientUnits="userSpaceOnUse">
            <stop offset="0.073" stopColor="white" stopOpacity="0"/>
            <stop offset="0.21" stopColor="white"/>
            <stop offset="0.805" stopColor="white"/>
            <stop offset="0.94" stopColor="white" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// ── Founder data ──────────────────────────────────────────────────────────────

const FOUNDERS = [
  {
    id: 'vicky',
    name: 'Vicky Hissaria',
    title: 'CO-FOUNDER AND CEO',
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
    bio: [
      'Digital identity is evolving from usernames into ownership layers. We are building infrastructure where identities become programmable, powering wallets, payments, communities, and digital presence across chains. Endless Domains is not just naming the internet. We are helping shape its next OS.',
    ],
  },
]

// ── Core team cards ───────────────────────────────────────────────────────────

const CORE_TEAM = [
  { id: 'shivam',   name: 'Shivam Arora',    title: 'Growth Head',             imageUrl: '/about-us/himanshu.jpg', linkedin: 'https://www.linkedin.com/in/shivamendlessdomains/' },
  { id: 'pallavi',  name: 'Pallavi Patodia', title: 'Digital Media Manager',   imageUrl: '/about-us/pallavi.jpg',  linkedin: 'https://www.linkedin.com/in/pallavi-patodia-6764a51ba/' },
  { id: 'mohit',    name: 'Mohit Agarwal',   title: 'Project Manager',         imageUrl: '/about-us/mohit.jpg',    linkedin: 'https://www.linkedin.com/in/moagrw/' },
]

// ── Team member cards ─────────────────────────────────────────────────────────

const TEAM_MEMBERS = [
  { id: 'himanshu', name: 'Himanshu Sachan',    title: 'Web3 Marketing',            imageUrl: '/about-us/himanshu.jpg',  linkedin: 'https://www.linkedin.com/in/sachanh/' },
  { id: 'rahul',    name: 'Rahul Sodhi',        title: 'Social Media Manager',      imageUrl: '/about-us/rahul.jpg',     linkedin: 'https://www.linkedin.com/in/rahul-sodhi-performance-marketer/' },
  { id: 'smriti',   name: 'Smriti Singh',       title: 'Developer',                 imageUrl: '/about-us/smriti.jpg',    linkedin: 'https://www.linkedin.com/in/smriti-singh0710/' },
  { id: 'jay',      name: 'Khamgoulun Haokip',  title: 'UI/UX Designer',            imageUrl: '/about-us/jay.jpg',       linkedin: 'https://www.linkedin.com/in/khamgoulun-haokip' },
  { id: 'bhavuk',   name: 'Bhavuk Kathuria',    title: 'Graphic Designer',          imageUrl: '/about-us/bhavuk.jpg',    linkedin: 'https://www.linkedin.com/in/bhavuk-kathuria-0a1512291/' },
  { id: 'shresth',  name: 'Shresth Singh',      title: 'Video Editor',              imageUrl: '/about-us/shresth.jpg',   linkedin: 'https://www.linkedin.com/in/shresth-singh-2abbb4249/' },
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

      {/* ── Top SVG trapezoid decoration ── */}
      <div className={styles.topPolygon} aria-hidden="true">
        <TrapezoidSVG />
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
                  <p className={styles.founderName}>{founder.name}</p>
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
                  className={styles.founderPhoto}
                  unoptimized
                  priority
                />
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedinBadge}
                  aria-label={`${founder.name} on LinkedIn`}
                >
                  <FaLinkedin aria-hidden="true" />
                </a>
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
