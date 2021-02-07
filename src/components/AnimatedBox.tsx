import { Animated } from 'react-native'
import ReAnimated from 'react-native-reanimated'
import Box from './Box'

const AnimatedBox = Animated.createAnimatedComponent(Box)
export const ReAnimatedBox = ReAnimated.createAnimatedComponent(Box)

export default AnimatedBox
