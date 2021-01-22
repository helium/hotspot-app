import { createBox } from '@shopify/restyle'
import { BlurView, BlurProps } from 'expo-blur'
import { Animated } from 'react-native'

import { Theme } from '../theme/theme'

const BlurBox = createBox<
  Theme,
  BlurProps & {
    children?: React.ReactNode
  }
>(BlurView)

export default BlurBox

const AnimatedBlurBox = Animated.createAnimatedComponent(BlurBox)

export { AnimatedBlurBox }
