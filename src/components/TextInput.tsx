/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import {
  createRestyleComponent,
  VariantProps,
  createVariant,
  createBox,
} from '@shopify/restyle'
import { TextInput as RNTextInput } from 'react-native'
import { Colors, Theme } from '../theme/theme'
import { useColors } from '../theme/themeHooks'

const TextInputBox = createBox<Theme, React.ComponentProps<typeof RNTextInput>>(
  RNTextInput,
)

const TextInput = createRestyleComponent<
  VariantProps<Theme, 'inputVariants'> &
    React.ComponentProps<typeof TextInputBox>,
  Theme
>([createVariant({ themeKey: 'inputVariants' })], TextInputBox)

type Props = React.ComponentProps<typeof TextInput> & {
  placeholderTextColor?: Colors
}

const TI = ({ variant, placeholderTextColor, ...rest }: Props) => {
  const colors = useColors()

  const getPlaceholderTextColor = () => {
    if (placeholderTextColor) return colors[placeholderTextColor]

    if (variant === 'regular') {
      return colors.inputPlaceholderText
    }
    return undefined
  }

  return (
    <TextInput
      placeholderTextColor={getPlaceholderTextColor()}
      variant={variant}
      {...rest}
    />
  )
}

export default TI
