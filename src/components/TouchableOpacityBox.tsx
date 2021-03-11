import React from 'react'
import { createBox } from '@shopify/restyle'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Theme } from '../theme/theme'
import WithDebounce from './WithDebounce'

const TouchableOpacityBox = createBox<
  Theme,
  TouchableOpacityProps & {
    children?: React.ReactNode
  }
>(TouchableOpacity)

export default TouchableOpacityBox

export type TouchableOpacityBoxProps = React.ComponentProps<
  typeof TouchableOpacityBox
>
export const DebouncedTouchableOpacityBox = WithDebounce(TouchableOpacityBox)
