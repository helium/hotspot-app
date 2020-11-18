/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import {
  createRestyleComponent,
  VariantProps,
  createVariant,
  createBox,
  useTheme,
} from '@shopify/restyle'
import { TextInput as RNTextInput } from 'react-native'
import { Colors, Theme } from '../theme/theme'

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
  const theme = useTheme<Theme>()

  const getPlaceholderTextColor = () => {
    if (placeholderTextColor) return theme.colors[placeholderTextColor]

    if (variant === 'regular') {
      return theme.colors.inputPlaceholderText
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
