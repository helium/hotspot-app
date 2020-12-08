import React from 'react'
import Svg, { Line } from 'react-native-svg'

const HotspotSvg = ({ size, color }: { size: number; color: string }) => {
  return (
    <Svg width={size} height={size} fill="none" viewBox={`0 0 ${size} ${size}`}>
      <Line y1="17" x2="22" y2="17" stroke={color} strokeWidth="2" />
      <Line y1="1" x2="22" y2="1" stroke={color} strokeWidth="2" />
      <Line x1="4" y1="9" x2="18" y2="9" stroke={color} strokeWidth="2" />
    </Svg>
  )
}

export default HotspotSvg
