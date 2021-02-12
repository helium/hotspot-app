import React from 'react'
import { createBox } from '@shopify/restyle'
import { TouchableHighlight, TouchableHighlightProps } from 'react-native'
import { Theme } from '../theme/theme'
import WithDebounce from './WithDebounce'

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

export const DebouncedTouchableHighlightBox = WithDebounce(
  TouchableHighlightBox,
)
