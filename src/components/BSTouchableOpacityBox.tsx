import React from 'react'
import { createBox } from '@shopify/restyle'
import { TouchableOpacityProps } from 'react-native'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
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
