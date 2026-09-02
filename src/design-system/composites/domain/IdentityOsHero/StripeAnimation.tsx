'use client';
import styles from './IdentityOsHero.module.scss';

const R = 561.812;
const CIRCUMFERENCE = 2 * Math.PI * R;

// c0/c1 each get exactly one stroke that starts right at the top edge of the hero
// (y=200) and sweeps downward into the visible dip, looping forever — instead of the
// leading+trailing blade pair.
// c0: starts at 37.7° (x≈523, y=200 — the top edge). Sweeping with *increasing* angle
// moves it downward (37.7°→90°, the dip's lowest point, y=418) before continuing on.
// c1 mirrors this at 142.3° (x≈996, y=200) — sweeping with *decreasing* angle moves it
// downward the same way (142.3°→90°, the dip's lowest point).
// c2/c3 (bottom corners) are untouched — original leading+trailing blade pair.
const CIRCLES = [
  { id: 'c0', cx: -11.515,  cy: -143.812, startDeg: 37.7,  dir: 1,  single: true  },
  { id: 'c1', cx: 1530.112, cy: -143.812, startDeg: 142.3, dir: -1, single: true  },
  { id: 'c2', cx: 78.485,   cy: 837.763,  startDeg: 270,   dir: 1,  single: false },
  { id: 'c3', cx: 1438.112, cy: 837.763,  startDeg: 90,    dir: 1,  single: false },
] as const;

const DUR = '5s';

const DASH_A = 160;
const GAP_A  = CIRCUMFERENCE - DASH_A;

const DASH_B = 160;
const GAP_B  = CIRCUMFERENCE - DASH_B;

const STAGGER = 15;

export default function StripeAnimation() {
  return (
    <div className={styles.animationContainer}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 200 1512 600"
        fill="none"
        className={styles.animationSvg}
        aria-hidden="true"
      >
        <defs>

        </defs>

        {/* ── Static track circles ── */}
        {CIRCLES.map(({ id, cx, cy }) => (
          <circle
            key={id}
            cx={cx}
            cy={cy}
            r={R}
            stroke="#e4e4e480"
            strokeWidth="1"
            fill="none"
          />
        ))}

        {/* ── Animated blades ── */}
        {CIRCLES.map(({ id, cx, cy, startDeg, dir, single }) => {
          // The dash sits at the 3 o'clock position (cx+R, cy) before rotation.
          // We define the gradient along that dash's tangent (vertical at 3 o'clock).
          const dashTop    = cy - DASH_A / 2;
          const dashBottom = cy + DASH_A / 2;

          const dashTopB    = cy - DASH_B / 2;
          const dashBottomB = cy + DASH_B / 2;

          return (
            <g key={`blades-${id}`}>
              {/* Blade A — leading, brighter */}
              <g filter="url(#glow)">
                {/* Rotate the entire group: gradient + circle together */}
                <g>
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`${startDeg} ${cx} ${cy}`}
                    to={`${startDeg + dir * 360} ${cx} ${cy}`}
                    dur={DUR}
                    repeatCount="indefinite"
                  />

                  <linearGradient
                    id={`grad-${id}-a`}
                    gradientUnits="userSpaceOnUse"
                    x1={cx + R}
                    y1={dashBottom}
                    x2={cx + R}
                    y2={dashTop}
                  >
                    <stop offset="0%" stopColor="#9457F6" stopOpacity="0" />
                    <stop offset="100%" stopColor="#9457F6" stopOpacity="1" />
                  </linearGradient>

                  <circle
                    cx={cx}
                    cy={cy}
                    r={R}
                    stroke={`url(#grad-${id}-a)`}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${DASH_A} ${GAP_A}`}
                    fill="none"
                  />
                </g>
              </g>

              {/* Blade B — trailing, softer. c0/c1 skip this: a single blade reads as
                  one unambiguous stroke per circle instead of two separately-visible
                  glows. c2/c3 keep the original leading+trailing pair. */}
              {!single && (
                <g filter="url(#glow-soft)">
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`${startDeg - STAGGER} ${cx} ${cy}`}
                      to={`${startDeg - STAGGER + dir * 360} ${cx} ${cy}`}
                      dur={DUR}
                      repeatCount="indefinite"
                    />

                    <linearGradient
                      id={`grad-${id}-b`}
                      gradientUnits="userSpaceOnUse"
                      x1={cx + R}
                      y1={dashBottomB}
                      x2={cx + R}
                      y2={dashTopB}
                    >
                      <stop offset="0%" stopColor="#9457F6" stopOpacity="0" />
                      <stop offset="100%" stopColor="#9457F6" stopOpacity="1" />
                    </linearGradient>

                    <circle
                      cx={cx}
                      cy={cy}
                      r={R}
                      stroke={`url(#grad-${id}-b)`}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${DASH_B} ${GAP_B}`}
                      fill="none"
                    />
                  </g>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
