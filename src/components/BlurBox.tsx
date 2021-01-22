import { createBox } from '@shopify/restyle'
import { BlurView, BlurProps } from 'expo-blur'
import { Animated } from 'react-native'
import ReAnimated from 'react-native-reanimated'

import { Theme } from '../theme/theme'

const BlurBox = createBox<
  Theme,
  BlurProps & {
    children?: React.ReactNode
  }
>(BlurView)

export default BlurBox

const AnimatedBlurBox = Animated.createAnimatedComponent(BlurBox)
const ReAnimatedBlurBox = ReAnimated.createAnimatedComponent(BlurBox)

export { AnimatedBlurBox, ReAnimatedBlurBox }
