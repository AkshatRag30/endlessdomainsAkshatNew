import React from 'react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { pvSparklineData } from './mockAnalyticsData'

interface Props {
  data?: Array<{ i: number; v: number }>
}

const PVSparkline: React.FC<Props> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data ?? pvSparklineData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
      <defs>
        <linearGradient id="pvSparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#2639ED" stopOpacity={0.18} />
          <stop offset="95%" stopColor="#2639ED" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="v"
        stroke="#2639ED"
        strokeWidth={1.5}
        fill="url(#pvSparkGrad)"
        dot={false}
        activeDot={false}
        isAnimationActive={false}
      />
    </AreaChart>
  </ResponsiveContainer>
)

export default PVSparkline
