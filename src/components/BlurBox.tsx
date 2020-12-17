import { createBox } from '@shopify/restyle'
import { BlurView, BlurProps } from 'expo-blur'

import { Theme } from '../theme/theme'

const BlurBox = createBox<
  Theme,
  BlurProps & {
    children?: React.ReactNode
  }
>(BlurView)

export default BlurBox
