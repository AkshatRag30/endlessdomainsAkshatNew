import dynamic from 'next/dynamic'
import type { SparklineProps } from './Sparkline'

// ssr:false — recharts measures the DOM and breaks under SSR, same reason
// the main site dynamic-imports its own PVSparkline.
export const Sparkline = dynamic<SparklineProps>(() => import('./Sparkline'), { ssr: false })

export default Sparkline
export type { SparklineProps }
