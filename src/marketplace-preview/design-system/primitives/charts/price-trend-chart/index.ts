import dynamic from 'next/dynamic'
import type { PriceTrendChartProps } from './PriceTrendChart'

// ssr:false — recharts measures the DOM and breaks under SSR, same as
// Sparkline. The plot's own height lives in the chart's stylesheet, so the
// caller reserves the space while this loads.
export const PriceTrendChart = dynamic<PriceTrendChartProps>(() => import('./PriceTrendChart'), { ssr: false })

export default PriceTrendChart
export type { PriceTrendChartProps }
