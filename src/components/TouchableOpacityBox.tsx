import React from 'react'
import { createBox } from '@shopify/restyle'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Theme } from '../theme/theme'

const TouchableOpacityBox = createBox<
  Theme,
  TouchableOpacityProps & {
    children: React.ReactNode
  }
>(TouchableOpacity)

export default TouchableOpacityBox

export type TouchableOpacityBoxProps = React.ComponentProps<
  typeof TouchableOpacityBox
>
