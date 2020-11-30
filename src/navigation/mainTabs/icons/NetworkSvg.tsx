import React from 'react'
import Svg, { Rect } from 'react-native-svg'

const HotspotSvg = ({ size, color }: { size: number; color: string }) => {
  return (
    <Svg width={size} height={size} fill="none" viewBox={`0 0 ${size} ${size}`}>
      <Rect
        x="1"
        y="1"
        width="20"
        height="20"
        rx="10"
        stroke={color}
        strokeWidth="2"
      />
      <Rect
        x="7"
        y="7"
        width="8"
        height="8"
        rx="4"
        stroke={color}
        strokeWidth="2"
      />
    </Svg>
  )
}

export default HotspotSvg
