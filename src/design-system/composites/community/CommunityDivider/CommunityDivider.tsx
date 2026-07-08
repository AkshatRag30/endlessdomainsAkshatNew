import React from 'react'
import styles from './CommunityDivider.module.scss'

export interface CommunityDividerProps {
  rotate?: boolean
}

export function CommunityDivider({ rotate = false }: CommunityDividerProps) {
  return (
    <div className={`${styles.section} ${rotate ? styles.tight : ''}`} aria-hidden="true">
      <svg
        className={`${styles.svg} ${rotate ? styles.rotated : ''}`}
        width="100%"
        height="91"
        viewBox="0 0 1512 91"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g filter="url(#communityDividerFilter0)">
          <path
            d="M623 0.00012207H756V40.0001H623L572 91.0001H-24V51.0001H572L623 0.00012207Z"
            fill="url(#communityDividerPaint0)"
            fillOpacity="0.2"
          />
        </g>
        <g filter="url(#communityDividerFilter1)">
          <path d="M572 90.5001V51.5001L622.5 1.00012V40.5001L572 90.5001Z" fill="white" />
          <path
            d="M572 90.5001V51.5001L622.5 1.00012V40.5001L572 90.5001Z"
            fill="url(#communityDividerPattern0)"
            fillOpacity="0.14"
          />
        </g>
        <g filter="url(#communityDividerFilter2)">
          <path
            d="M889 6.55078e-05L756 5.38805e-05L756 40.0001L889 40.0001L940 91.0001L1536 91.0001L1536 51.0001L940 51.0001L889 6.55078e-05Z"
            fill="url(#communityDividerPaint1)"
            fillOpacity="0.2"
          />
        </g>
        <g filter="url(#communityDividerFilter3)">
          <path d="M940 90.5001L940 51.5001L889.5 1.00012L889.5 40.5001L940 90.5001Z" fill="white" />
          <path
            d="M940 90.5001L940 51.5001L889.5 1.00012L889.5 40.5001L940 90.5001Z"
            fill="url(#communityDividerPattern1)"
            fillOpacity="0.14"
          />
        </g>
        <defs>
          <filter id="communityDividerFilter0" x="-24" y="0.00012207" width="780" height="91" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="27.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_1190" />
          </filter>
          <filter id="communityDividerFilter1" x="572" y="1.00012" width="50.5" height="89.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="21.05" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.14902 0 0 0 0 0.223529 0 0 0 0 0.929412 0 0 0 1 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_1190" />
          </filter>
          <pattern id="communityDividerPattern0" patternContentUnits="objectBoundingBox" width="0.0904716" height="0.0510482">
            <use xlinkHref="#communityDividerImage0" transform="scale(0.00904716 0.00510482)" />
          </pattern>
          <filter id="communityDividerFilter2" x="756" y="0" width="780" height="91.0001" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="27.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_1190" />
          </filter>
          <filter id="communityDividerFilter3" x="889.5" y="1.00012" width="50.5" height="89.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="21.05" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.14902 0 0 0 0 0.223529 0 0 0 0 0.929412 0 0 0 1 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1_1190" />
          </filter>
          <pattern id="communityDividerPattern1" patternContentUnits="objectBoundingBox" width="0.0904716" height="0.0510482">
            <use xlinkHref="#communityDividerImage0" transform="scale(0.00904716 0.00510482)" />
          </pattern>
          <linearGradient id="communityDividerPaint0" x1="-390" y1="91.0001" x2="756" y2="51.0001" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2639ED" stopOpacity="0" />
            <stop offset="1" stopColor="#2639ED" />
          </linearGradient>
          <linearGradient id="communityDividerPaint1" x1="1902" y1="91.0002" x2="756" y2="51.0001" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2639ED" stopOpacity="0" />
            <stop offset="1" stopColor="#2639ED" />
          </linearGradient>
          <image
            id="communityDividerImage0"
            width="10"
            height="10"
            preserveAspectRatio="none"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAcSURBVHgB7cohAQAAAMKw9y8NFVCoTw82MZ1TAe0QCfcGJVSnAAAAAElFTkSuQmCC"
          />
        </defs>
      </svg>
    </div>
  )
}

export default CommunityDivider
