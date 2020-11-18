import React from 'react'
import { createBox } from '@shopify/restyle'
import { TouchableHighlight, TouchableHighlightProps } from 'react-native'
import { Theme } from '../theme/theme'

const TouchableHighlightBox = createBox<
  Theme,
  TouchableHighlightProps & {
    children: React.ReactNode
  }
>(TouchableHighlight)

export default TouchableHighlightBox

export type TouchableHighlightBoxProps = React.ComponentProps<
  typeof TouchableHighlightBox
>
