# Claude Code Prompt: Parked Domains Roadmap — Horizontal Scroll Animation
## (Video-verified, Figma-accurate — replace previous prompt entirely)

---

## What You're Building

A **full-section horizontal scroll roadmap** for the Parked Domains product. The section is divided into two horizontal halves that are **fixed/sticky** while the user scrolls:

- **Left half (≈50% width):** A large title block — "How to / Park Your Domain." — with an eyebrow label "SETUP GUIDE" inside animated bracket corners. This stays **completely still** during horizontal scroll.
- **Right half (≈50% width):** A paragraph subtitle — "From login to live in under 5 minutes. Do this exactly once. After that it runs itself." — also stays still.

Below those two header halves is a **dashed horizontal rule** that separates the header from the step track area. Then the step track scrolls horizontally underneath the pinned header.

The scrolling lower section contains 7 step cards that translate horizontally as you scroll. Two cards are visible at once: one above the axis, one below. Steps alternate top/bottom in a zigzag. The **dashed ruler strip** (hundreds of tiny vertical ticks) runs the full width of the track, right through the middle (the axis line between above and below steps).

At the very bottom of the page (bottom of viewport) there are **prev/next arrow buttons** — a pill-shaped dark button with `<` and `>` — for manual navigation between steps.

---

## Tech Stack

Vanilla JS + GSAP 3 + Lenis. Single `index.html` file.

```html
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500&display=swap" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

---

## Layout Architecture (Critical — Read This First)

The section is structured as:

```
<section class="roadmap-section">          ← height: 100vh + (totalScrollDistance)
  <div class="roadmap-sticky">             ← position: sticky; top: 0; height: 100vh; overflow: hidden

    <!-- UPPER FIXED HEADER: Never moves -->
    <div class="roadmap-header">
      <div class="header-left">            ← ~50% wide, left side
        <div class="eyebrow-wrap">         ← contains bracket corners + "SETUP GUIDE" label
          <span class="bracket-tl"></span>
          <span class="eyebrow-text">SETUP GUIDE</span>
          <span class="bracket-tr"></span>
        </div>
        <h2 class="main-title">
          <span class="title-line1">How to</span>
          <span class="title-line2">Park Your Domain.</span>  ← blue gradient
        </h2>
      </div>
      <div class="header-right">           ← ~50% wide, right side, top-aligned
        <p class="header-subtitle">From login to live in under 5 minutes. Do this exactly once. After that it runs itself.</p>
      </div>
    </div>

    <!-- DASHED HORIZONTAL RULE (separates header from track) -->
    <div class="section-divider"></div>    ← 1px dashed line, full width, rgba(38,57,237,0.15)

    <!-- THE SCROLLING TRACK -->
    <div class="roadmap-track-wrap">       ← clips overflow
      <div class="roadmap-track">          ← translateX driven by GSAP

        <!-- DASHED RULER (the tick-mark strip running horizontally) -->
        <svg class="ruler-strip">...</svg>  ← full track width, at vertical midpoint

        <!-- 7 STEP CARDS -->
        <div class="step" data-pos="top" data-index="0">...</div>
        <div class="step" data-pos="bottom" data-index="1">...</div>
        ...etc
      </div>
    </div>

  </div>

  <!-- PREV/NEXT NAV (position: fixed, bottom center) -->
  <div class="roadmap-nav">
    <button class="nav-btn" id="nav-prev">‹</button>
    <div class="nav-divider"></div>
    <button class="nav-btn" id="nav-next">›</button>
  </div>

</section>
```

---

## Design Tokens

```css
:root {
  --blue: #2639ED;
  --blue-47: rgba(38, 57, 237, 0.47);
  --blue-28: rgba(38, 57, 237, 0.28);
  --blue-12: rgba(38, 57, 237, 0.12);
  --blue-15: rgba(38, 57, 237, 0.15);
  --text-body: #474747;
  --text-black: #0d0d0d;
  --white: #ffffff;
  --bg: #ffffff;

  /* Step badge */
  --badge-shadow:
    0px 25.3px 64.5px rgba(87,177,255,0.34),
    0px 14.9px 19.4px rgba(87,177,255,0.19),
    0px 6.2px 8.1px rgba(87,177,255,0.22),
    0px 2.2px 2.9px rgba(87,177,255,0.15),
    0 0 0 2.41px #e0e9f2,
    0 0 0 3px white;
  --badge-inset:
    inset 0px 0.6px 10.8px 1.2px #d2eaff,
    inset 0px 0.6px 2.4px 1.2px #d2eaff;
}
```

---

## Section Header Details

### Left Side
- Eyebrow: `"SETUP GUIDE"` in Space Grotesk 500, `11px`, `letter-spacing: 0.12em`, `text-transform: uppercase`, color `rgba(0,0,0,0.45)`.
- **Bracket corners:** Small L-shaped corner brackets around the eyebrow text, drawn with CSS (2 pseudo-elements per bracket). Each bracket is ~`14×14px`, `1.5px` stroke, color `rgba(38,57,237,0.45)`. **Animation: on section entry, the brackets animate from opacity 0 + slightly inward position → opacity 1 + correct position**, over ~0.4s. The top-left bracket draws from the top-left corner outward; the top-right from the top-right. This is a subtle "scanning" effect — implement as CSS `clip-path` or `scaleX/scaleY` reveal per arm.
- `"How to"` — Satoshi Bold (or system fallback bold), `~72px`, color `#0d0d0d`, no gradient.
- `"Park Your Domain."` — Satoshi Bold, same size (~72px), **gradient text**: `linear-gradient(135deg, #2639ED 0%, rgba(38,57,237,0.5) 100%)` applied via `background-clip: text`.
- **Entry animation:** Both lines slide up from `y: 30` → `y: 0` with `opacity: 0 → 1` when section enters viewport. Stagger 0.1s between line 1 and line 2.

### Right Side
- `"From login to live in under 5 minutes. Do this exactly once. After that it runs itself."` — Space Grotesk 400, `~15px`, color `#474747`, `max-width: 340px`, top-aligned to match the bracket/eyebrow row height.
- **Entry animation:** Fades in with a slight `x: 20 → 0` translate after the title starts, delay ~0.2s.
- There's a subtle bracket corner in the top-right of the right half as well (mirror of the left eyebrow brackets). Same animation.

---

## The Dashed Horizontal Rule

Between the header and the step track, there's a thin `1px` dashed line spanning the full viewport width:

```css
.section-divider {
  width: 100%;
  height: 1px;
  border-top: 1px dashed rgba(38, 57, 237, 0.15);
  margin: 0;
}
```

This is the **same dashed style** as the ruler strip — it confirms the visual language.

---

## The Step Track

### Dimensions
- Track height: `100%` of remaining viewport below the header (~`55vh`)
- Each step slot width: `~640px` (steps are evenly distributed along the track)
- Total track width: `640px × 7 = ~4480px` (pad left/right with `~120px`)
- The axis (midline) runs horizontally at exactly `50%` of the track height

### The Dashed Ruler Strip (The Tick Marks)
This is the bold visual element — the dense field of small vertical rectangles running the full width at the axis:

```javascript
function buildRuler(trackEl) {
  const totalWidth = trackEl.scrollWidth;
  const tickW = 5, tickH = 16, gap = 4, rx = 2;
  const count = Math.ceil(totalWidth / (tickW + gap)) + 10;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = `
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    overflow: visible;
  `;
  svg.setAttribute('width', totalWidth);
  svg.setAttribute('height', tickH);

  for (let i = 0; i < count; i++) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', i * (tickW + gap));
    rect.setAttribute('y', 0);
    rect.setAttribute('width', tickW);
    rect.setAttribute('height', tickH);
    rect.setAttribute('rx', rx);
    rect.setAttribute('fill', 'rgba(38,57,237,0.18)');
    svg.appendChild(rect);
  }
  trackEl.appendChild(svg);
}
```

The **left portion of the ruler (already-scrolled steps) appears at full opacity ~0.18**, while unseen ticks ahead are at ~0.08 — create this with a subtle `linearGradient` fill that goes from `rgba(38,57,237,0.22)` on left to `rgba(38,57,237,0.08)` on right. Alternatively, just use uniform opacity — both look fine.

---

## Step Card Structure

Each step alternates position: odd-indexed (0, 2, 4, 6) are **above** the axis; even-indexed (1, 3, 5) are **below** the axis.

```html
<!-- ABOVE-AXIS STEP (e.g. step 01) -->
<div class="step above" data-index="0">
  <!-- Content sits in top half, reading downward -->
  <div class="step-content">
    <div class="step-badge">
      <span class="step-num">01</span>
    </div>
    <div class="step-text">
      <h3 class="step-title">Log in to Endless Domains</h3>
      <p class="step-desc">Visit endlessdomains.io and sign in to your account.</p>
    </div>
  </div>
  <!-- Connector: vertical line + dot AT the axis -->
  <div class="step-connector">
    <svg class="connector-line">...</svg>   ← from content area down to axis
    <div class="connector-dot"></div>        ← sits exactly ON the axis line
  </div>
</div>

<!-- BELOW-AXIS STEP (e.g. step 02) -->
<div class="step below" data-index="1">
  <!-- Connector: dot AT the axis, line going down into content -->
  <div class="step-connector">
    <div class="connector-dot"></div>
    <svg class="connector-line">...</svg>
  </div>
  <!-- Content sits in bottom half -->
  <div class="step-content">
    <div class="step-badge">
      <span class="step-num">02</span>
    </div>
    <div class="step-text">
      <h3 class="step-title">Get your domain <span class="step-subtitle-note">( Skip if you own one )</span></h3>
      <p class="step-desc">Purchase any Web3 domain from $2. Owned permanently with no renewals. If you already have one, go straight to My Domains.</p>
    </div>
  </div>
</div>
```

### Step Content Layout
- **Badge + text are side-by-side** (flex row, gap ~16px)
- Badge is left, text is right
- For above-axis steps: content is vertically bottom-aligned within the top half (so it sits close to the axis)
- For below-axis steps: content is vertically top-aligned within the bottom half (sits close to the axis)

### Step Badge
```css
.step-badge {
  width: 52px;
  height: 50px;
  border-radius: 3.3px;
  flex-shrink: 0;
  position: relative;
  background: linear-gradient(to bottom, #2639ED, rgba(38,57,237,0.47));
  box-shadow: var(--badge-shadow);
}
.step-badge::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: var(--badge-inset);
}
.step-num {
  position: relative;
  z-index: 1;
  font-family: 'Satoshi', sans-serif;
  font-weight: 500;
  font-size: 17px;
  color: white;
  text-shadow: 0 1px 1.3px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
```

The badge has a **radial glow orb** behind it — a soft blue gradient spread of ~`110px` diameter centered behind the badge, `opacity: 0.35`, `pointer-events: none`. This is just an absolutely-positioned `div` with a radial-gradient background.

```css
.badge-glow {
  position: absolute;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(38,57,237,0.35) 0%, transparent 65%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: -1;
}
```

### Step Title Typography
```css
.step-title {
  font-family: 'Satoshi', sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.2;
  background: linear-gradient(125deg, #2639ED 70%, rgba(38,57,237,0.28) 96%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  max-width: 320px;
  margin-bottom: 8px;
}
.step-subtitle-note {
  /* For step 02's "( Skip if you own one )" */
  font-family: 'Satoshi', sans-serif;
  font-weight: 400;
  font-size: 13px;
  -webkit-text-fill-color: #0d0d0d;
  color: #0d0d0d;
}
.step-desc {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 400;
  font-size: 13.5px;
  line-height: 1.35;
  color: #474747;
  text-align: justify;
  max-width: 300px;
}
```

### The Connector: Vertical Line + Dot

The connector is a thin vertical line going from the step content down to (or up from) the axis, with a small circle at the exact axis crossing point.

**The vertical line** is an SVG with a `linearGradient` stroke — transparent at top, opaque blue in middle, transparent at bottom. Height ~`120-150px` (distance from content to axis).

**The connector dot** sits exactly at the axis level:
```css
.connector-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid rgba(38,57,237,0.5);
  background: white;
  position: absolute;
  /* centered on axis */
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
/* Glow halo behind dot */
.connector-dot::before {
  content: '';
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(38,57,237,0.25) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

---

## The 7 Steps (Complete Content)

| Index | Position | Num | Title | Description |
|-------|----------|-----|-------|-------------|
| 0 | above | 01 | Log in to Endless Domains | Visit endlessdomains.io and sign in to your account. |
| 1 | below | 02 | Get your domain *(Skip if you own one)* | Purchase any Web3 domain from $2. Owned permanently with no renewals. If you already have one, go straight to My Domains. |
| 2 | above | 03 | Go to My Domains and click Manage | Select your domain from the list and open the Manage view. |
| 3 | below | 04 | Click Parked Domains then Create | Open the Parked Domains tab and click Create to begin setup. |
| 4 | above | 05 | Select your template | Choose Individual, Influencer, or Business. Each has a purpose-built layout. |
| 5 | below | 06 | IPFS link is created | The platform handles the IPFS connection automatically. Your domain resolves to your branded page on-chain. |
| 6 | above | 07 | Your domain is parked and earning | Visitors see your branded page with ads. Revenue flows to your wallet. Nothing more to manage. |

---

## GSAP Animation System

### 1. Lenis Initialization

```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### 2. Section Entry Animations (before horizontal scroll begins)

These fire once as the section scrolls into view:

```javascript
// Header left: title lines stagger up
gsap.from('.title-line1', {
  y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.roadmap-section', start: 'top 80%', once: true }
});
gsap.from('.title-line2', {
  y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.1,
  scrollTrigger: { trigger: '.roadmap-section', start: 'top 80%', once: true }
});

// Header right: subtitle fades+slides in
gsap.from('.header-subtitle', {
  x: 20, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.2,
  scrollTrigger: { trigger: '.roadmap-section', start: 'top 80%', once: true }
});

// Bracket corners: each arm reveals via clip-path or scale
// TL bracket: horizontal arm scales from 0→1 left-to-right, vertical arm 0→1 top-to-bottom
gsap.from('.bracket-tl', {
  scaleX: 0, scaleY: 0, transformOrigin: 'top left',
  duration: 0.4, ease: 'power2.out',
  scrollTrigger: { trigger: '.roadmap-section', start: 'top 80%', once: true }
});
gsap.from('.bracket-tr', {
  scaleX: 0, scaleY: 0, transformOrigin: 'top right',
  duration: 0.4, ease: 'power2.out', delay: 0.05,
  scrollTrigger: { trigger: '.roadmap-section', start: 'top 80%', once: true }
});
// For right-side brackets (near subtitle):
gsap.from('.bracket-rt', {
  scaleX: 0, scaleY: 0, transformOrigin: 'top right',
  duration: 0.35, ease: 'power2.out', delay: 0.15,
  scrollTrigger: { trigger: '.roadmap-section', start: 'top 80%', once: true }
});
gsap.from('.bracket-rb', {
  scaleX: 0, scaleY: 0, transformOrigin: 'bottom right',
  duration: 0.35, ease: 'power2.out', delay: 0.2,
  scrollTrigger: { trigger: '.roadmap-section', start: 'top 80%', once: true }
});
```

### 3. Main Horizontal Scroll (Core Mechanic)

```javascript
gsap.registerPlugin(ScrollTrigger);

const track = document.querySelector('.roadmap-track');
const section = document.querySelector('.roadmap-section');
const sticky = document.querySelector('.roadmap-sticky');

// Calculate total horizontal travel
const getScrollDistance = () => track.scrollWidth - sticky.offsetWidth;

// Set section height = scroll distance + 1 viewport height
const setSectionHeight = () => {
  section.style.height = `${getScrollDistance() + window.innerHeight}px`;
};
setSectionHeight();
window.addEventListener('resize', () => {
  setSectionHeight();
  ScrollTrigger.refresh();
});

// The main horizontal tween
const hTween = gsap.to(track, {
  x: () => -getScrollDistance(),
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    start: 'top top',
    end: () => `+=${getScrollDistance()}`,
    scrub: 1,               // 1 second scrub lag = momentum feel
    pin: sticky,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  }
});
```

### 4. Per-Step Fade-In Animations

Each step card fades in with a `y` translate as it enters the visible zone. Since steps move horizontally, we tie these to the scroll position where each step would cross the center of the viewport.

```javascript
const steps = document.querySelectorAll('.step');
const stepSlotWidth = track.scrollWidth / steps.length;

steps.forEach((step, i) => {
  // When does this step hit the center of the viewport?
  // Step center X in track coords: (i + 0.5) * stepSlotWidth
  // It reaches viewport center when track.x = -(stepCenterX - viewportWidth/2)
  const stepCenterX = (i + 0.5) * stepSlotWidth;
  const scrollAtCenter = stepCenterX - window.innerWidth * 0.5;
  const scrollStart = Math.max(0, scrollAtCenter - stepSlotWidth * 0.5);
  const scrollEnd = scrollAtCenter + stepSlotWidth * 0.2;

  const content = step.querySelector('.step-content');
  const isAbove = step.classList.contains('above');

  gsap.fromTo(content,
    { 
      opacity: 0, 
      y: isAbove ? 25 : -25   // above steps rise up, below steps rise up too
    },
    {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: `top+=${scrollStart} top`,
        end: `top+=${scrollEnd} top`,
        scrub: 0.6,
        invalidateOnRefresh: true,
      }
    }
  );

  // Badge glow pulse when step enters center
  gsap.fromTo(step.querySelector('.badge-glow'),
    { scale: 0.6, opacity: 0 },
    {
      scale: 1, opacity: 1,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: section,
        start: `top+=${scrollStart} top`,
        end: `top+=${scrollStart + 100} top`,
        scrub: 0.4,
        invalidateOnRefresh: true,
      }
    }
  );
});
```

### 5. SVG Connector Line Draw Animation

For each step's vertical connector line SVG:

```javascript
steps.forEach((step, i) => {
  const path = step.querySelector('.connector-path');
  if (!path) return;

  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

  const stepCenterX = (i + 0.5) * stepSlotWidth;
  const scrollAtCenter = stepCenterX - window.innerWidth * 0.5;

  gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: `top+=${Math.max(0, scrollAtCenter - stepSlotWidth * 0.4)} top`,
      end: `top+=${scrollAtCenter} top`,
      scrub: true,
      invalidateOnRefresh: true,
    }
  });
});
```

---

## Prev / Next Navigation

At the bottom center of the viewport (fixed position), show prev/next arrow buttons:

```html
<div class="roadmap-nav" id="roadmapNav">
  <button class="nav-btn" id="prevBtn">‹</button>
  <div class="nav-sep"></div>
  <button class="nav-btn" id="nextBtn">›</button>
</div>
```

```css
.roadmap-nav {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background: rgba(20,20,20,0.85);
  backdrop-filter: blur(8px);
  border-radius: 100px;
  padding: 8px 20px;
  gap: 12px;
  z-index: 1000;
  opacity: 0;  /* hidden until section is active */
  transition: opacity 0.3s;
}
.roadmap-nav.visible { opacity: 1; }
.nav-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.nav-btn:hover { opacity: 1; }
.nav-sep {
  width: 1px;
  height: 16px;
  background: rgba(255,255,255,0.25);
}
```

Navigation JS — snaps to each step position on click:

```javascript
let currentStep = 0;

function goToStep(index) {
  currentStep = Math.max(0, Math.min(steps.length - 1, index));
  const stepCenterX = (currentStep + 0.5) * stepSlotWidth;
  const scrollTarget = section.offsetTop + Math.max(0, stepCenterX - window.innerWidth * 0.5);
  lenis.scrollTo(scrollTarget, { duration: 1.2, easing: t => 1 - Math.pow(1 - t, 4) });
}

document.getElementById('prevBtn').addEventListener('click', () => goToStep(currentStep - 1));
document.getElementById('nextBtn').addEventListener('click', () => goToStep(currentStep + 1));

// Show/hide nav when section is active
ScrollTrigger.create({
  trigger: section,
  start: 'top top',
  end: () => `+=${getScrollDistance()}`,
  onEnter: () => document.getElementById('roadmapNav').classList.add('visible'),
  onLeave: () => document.getElementById('roadmapNav').classList.remove('visible'),
  onEnterBack: () => document.getElementById('roadmapNav').classList.add('visible'),
  onLeaveBack: () => document.getElementById('roadmapNav').classList.remove('visible'),
});

// Track current step from scroll position
ScrollTrigger.create({
  trigger: section,
  start: 'top top',
  end: () => `+=${getScrollDistance()}`,
  onUpdate: self => {
    const progress = self.progress;
    currentStep = Math.round(progress * (steps.length - 1));
  }
});
```

---

## Bracket Corner CSS (exact implementation)

The `SETUP GUIDE` eyebrow has corner brackets. Implement with 4 tiny `span` elements, each being one corner:

```css
.eyebrow-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding: 6px 12px;
  margin-bottom: 14px;
}

/* Each bracket is 14×14px L-shape made with borders */
.bracket-tl, .bracket-tr {
  width: 14px;
  height: 14px;
  display: block;
  flex-shrink: 0;
}
.bracket-tl {
  border-top: 1.5px solid rgba(38,57,237,0.5);
  border-left: 1.5px solid rgba(38,57,237,0.5);
}
.bracket-tr {
  border-top: 1.5px solid rgba(38,57,237,0.5);
  border-right: 1.5px solid rgba(38,57,237,0.5);
}
```

For the right-side header bracket (top-right of the subtitle block), place `bracket-rt` and `bracket-rb`:
```css
.bracket-rt {
  border-top: 1.5px solid rgba(38,57,237,0.5);
  border-right: 1.5px solid rgba(38,57,237,0.5);
}
.bracket-rb {
  border-bottom: 1.5px solid rgba(38,57,237,0.5);
  border-right: 1.5px solid rgba(38,57,237,0.5);
}
```

---

## Performance & Polish Details

1. Add `will-change: transform` to `.roadmap-track` before scroll starts, remove after:
   ```javascript
   ScrollTrigger.create({
     trigger: section,
     start: 'top 20%',
     onEnter: () => track.style.willChange = 'transform',
     onLeave: () => track.style.willChange = 'auto',
   });
   ```

2. The **dashed horizontal divider** between header and track extends the full viewport width — it's `position: absolute` spanning `100vw`, not tied to any content width.

3. The **above-axis steps** have their badge positioned near the bottom-right of the top half (so it's next to the axis) and the title/desc is to the right of the badge. The **below-axis steps** have badge near top-left of the bottom half (next to the axis below it).

4. The section background is pure white. No tinted background.

5. **Scroll snap is NOT used** — it's a pure scrub animation. The nav buttons handle step-to-step jumping.

6. On `@media (prefers-reduced-motion: reduce)`: disable all animations, set `scrub: false`, show all steps statically visible.

7. On `@media (max-width: 768px)`: disable horizontal scroll entirely. Render steps as a vertical timeline (badge on left, line in middle connecting them, content on right). Simple fade-in per step on scroll.

---

## Complete Checklist

- [ ] "SETUP GUIDE" eyebrow with bracket corners that animate in on section entry
- [ ] "How to / Park Your Domain." title with gradient on second line
- [ ] Right-side subtitle paragraph with bracket corners in top-right
- [ ] Thin dashed horizontal rule separating header from track
- [ ] Dashed ruler strip (500+ tick marks) running full track width at axis
- [ ] 7 step cards alternating above/below axis
- [ ] Each badge: blue gradient bg, inset glow shadow, outer box-shadow ring, number, glow orb behind
- [ ] Each step: gradient title (28px Satoshi Bold), gray description (Space Grotesk 14px)
- [ ] Step 02 title has inline "(Skip if you own one)" in black, non-gradient, smaller font
- [ ] Vertical connector SVG line + dot at axis for each step
- [ ] SVG connector lines animate stroke-dashoffset on scroll
- [ ] Lenis + GSAP ScrollTrigger synced correctly
- [ ] Main track translates horizontally via `scrub: 1` 
- [ ] Per-step content fades in as it enters viewport
- [ ] Prev/next pill navigation fixed at bottom center
- [ ] Nav shows/hides based on section visibility
- [ ] Mobile fallback vertical layout
- [ ] `prefers-reduced-motion` respected
