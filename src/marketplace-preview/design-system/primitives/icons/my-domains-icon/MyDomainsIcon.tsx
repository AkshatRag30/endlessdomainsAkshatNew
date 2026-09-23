import type { IconBaseProps } from 'react-icons'

// Figma-exported browser/globe glyph for the sidebar's "My domains" row —
// no react-icons equivalent matches this exact shape, so it's kept as a
// bespoke SVG component instead, shaped like an IconType (size/className
// props) so it drops into the same `icon?: string | IconType` sidebar data
// slot as every other row. Fill is currentColor, same as every react-icons
// row — inherits gray from .icon by default and blue from .activeIcon when
// selected, same as Explore/Watchlist/etc. Was hardcoded to Figma's
// #2639ED (--color-blue-primary) on every path, which made this row read
// as permanently selected regardless of its actual active state.
export const MyDomainsIcon = ({ size = '1em', title, ...rest }: IconBaseProps) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    {title && <title>{title}</title>}
    <path
      d="M10.5 1.3125H3.5C2.2925 1.3125 1.3125 2.2925 1.3125 3.5V10.5C1.3125 11.7075 2.2925 12.6875 3.5 12.6875H10.5C11.7075 12.6875 12.6875 11.7075 12.6875 10.5V3.5C12.6875 2.2925 11.7075 1.3125 10.5 1.3125ZM2.1875 3.5C2.1875 2.77813 2.77813 2.1875 3.5 2.1875H10.5C11.2219 2.1875 11.8125 2.77813 11.8125 3.5V3.9375H2.1875V3.5ZM11.8125 10.5C11.8125 11.2219 11.2219 11.8125 10.5 11.8125H3.5C2.77813 11.8125 2.1875 11.2219 2.1875 10.5V4.8125H11.8125V10.5Z"
      fill="currentColor"
    />
    <path
      d="M8.75 3.5C8.99162 3.5 9.1875 3.30412 9.1875 3.0625C9.1875 2.82088 8.99162 2.625 8.75 2.625C8.50838 2.625 8.3125 2.82088 8.3125 3.0625C8.3125 3.30412 8.50838 3.5 8.75 3.5Z"
      fill="currentColor"
    />
    <path
      d="M10.5 3.5C10.7416 3.5 10.9375 3.30412 10.9375 3.0625C10.9375 2.82088 10.7416 2.625 10.5 2.625C10.2584 2.625 10.0625 2.82088 10.0625 3.0625C10.0625 3.30412 10.2584 3.5 10.5 3.5Z"
      fill="currentColor"
    />
    <path
      d="M7 11.375C8.68875 11.375 10.0625 10.0012 10.0625 8.3125C10.0625 6.62375 8.68875 5.25 7 5.25C5.31125 5.25 3.9375 6.62375 3.9375 8.3125C3.9375 10.0012 5.31125 11.375 7 11.375ZM4.85625 8.75H5.70062C5.72687 9.275 5.80562 9.7825 5.93687 10.2113C5.39437 9.905 4.9875 9.38 4.85625 8.75ZM7.42437 7.875H6.57562C6.6325 6.92562 6.86 6.34375 7 6.16438C7.14 6.34375 7.3675 6.92562 7.42437 7.875ZM7.42437 8.75C7.3675 9.69938 7.14 10.2812 7 10.4606C6.86 10.2812 6.6325 9.69938 6.57562 8.75H7.42437ZM8.06313 10.2113C8.19438 9.7825 8.27312 9.275 8.29937 8.75H9.14375C9.01687 9.38 8.61 9.905 8.06313 10.2113ZM9.14375 7.875H8.29937C8.27312 7.35 8.19438 6.8425 8.06313 6.41375C8.60563 6.72 9.0125 7.245 9.14375 7.875ZM5.93687 6.41375C5.80562 6.8425 5.72687 7.35 5.70062 7.875H4.85625C4.98313 7.245 5.39 6.72 5.93687 6.41375Z"
      fill="currentColor"
    />
  </svg>
)

export default MyDomainsIcon
