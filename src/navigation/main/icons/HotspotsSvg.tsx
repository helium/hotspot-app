import React from 'react'
import Svg, { Path } from 'react-native-svg'

const HotspotsSvg = ({ size, color }: { size: number; color: string }) => {
  return (
    <Svg width={size} height={size} fill="none" viewBox={`0 0 ${size} ${size}`}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 0C1.79086 0 0 1.79086 0 4V15.9553C0 18.1644 1.79086 19.9553 4 19.9553H15.9553C18.1644 19.9553 19.9553 18.1644 19.9553 15.9553V4C19.9553 1.79086 18.1644 0 15.9553 0H4ZM9.97763 17.5822C14.1775 17.5822 17.5822 14.1775 17.5822 9.97763C17.5822 5.77773 14.1775 2.37305 9.97763 2.37305C5.77773 2.37305 2.37305 5.77773 2.37305 9.97763C2.37305 14.1775 5.77773 17.5822 9.97763 17.5822Z"
        fill={color}
      />
    </Svg>
  )
}

export default HotspotsSvg
