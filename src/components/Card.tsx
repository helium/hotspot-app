import {
  createRestyleComponent,
  VariantProps,
  createVariant,
} from '@shopify/restyle'

import { Theme } from '../theme/theme'
import Box from './Box'

const Card = createRestyleComponent<
  VariantProps<Theme, 'cardVariants'> & React.ComponentProps<typeof Box>,
  Theme
>([createVariant({ themeKey: 'cardVariants' })], Box)

export default Card
