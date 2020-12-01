import React from 'react'
import Svg, { Path } from 'react-native-svg'

const HotspotSvg = ({ size, color }: { size: number; color: string }) => {
  return (
    <Svg width={size} height={size} fill="none" viewBox={`0 0 ${size} ${size}`}>
      <Path
        d="M12.5601 1L21.9753 10.4153L12.5601 19.8305"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.72168 5.04596L11.0909 10.4152L5.72168 15.7845"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default HotspotSvg
