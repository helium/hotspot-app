import { createBox } from '@shopify/restyle'
import { Image, ImageProps } from 'react-native'

import { Theme } from '../theme/theme'

const ImageBox = createBox<Theme, ImageProps>(Image)

export default ImageBox
