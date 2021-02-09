import { createBox } from '@shopify/restyle'
import { BlurView, BlurViewProperties } from '@react-native-community/blur'

import { Theme } from '../theme/theme'

const BlurBox = createBox<
  Theme,
  BlurViewProperties & {
    children?: React.ReactNode
  }
>(BlurView)

export default BlurBox
