import React from 'react'
import Svg, { Rect } from 'react-native-svg'

const HotspotsSvg = ({ size, color }: { size: number; color: string }) => {
  return (
    <Svg width={size} height={size} fill="none" viewBox={`0 0 ${size} ${size}`}>
      <Rect
        x={1}
        y={1}
        width={20}
        height={20}
        rx={5}
        stroke={color}
        strokeWidth={2}
      />
      <Rect x={4} y={4} width={14} height={14} rx={7} stroke={color} />
    </Svg>
  )
}

export default HotspotsSvg
