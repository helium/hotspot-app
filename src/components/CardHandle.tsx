import { useTheme } from '@shopify/restyle'
import React from 'react'
import Svg, { Rect } from 'react-native-svg'
import { Theme } from '../theme/theme'

const CardHandle = () => {
  const theme = useTheme<Theme>()

  return (
    <Svg width={40} height={4}>
      <Rect
        width={40}
        height={4}
        rx={2}
        fill={theme.colors.blueGrayLight}
        opacity={0.3}
      />
    </Svg>
  )
}

export default CardHandle
