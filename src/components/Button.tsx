/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { TextStyle } from 'react-native'
import {
  useRestyle,
  spacing,
  border,
  backgroundColor,
  BoxProps,
} from '@shopify/restyle'

import Text from './Text'
import { Colors, Theme } from '../theme/theme'
import TouchableOpacityBox from './TouchableOpacityBox'

const restyleFunctions = [spacing, border, backgroundColor]
type Props = BoxProps<Theme> & {
  mode?: 'text' | 'contained'
  variant?: ButtonVariant
  onPress?: () => void
  disabled?: boolean
  title: string
  textStyle?: TextStyle
}

type ButtonVariant = 'primary' | 'secondary'

const Button = ({
  onPress,
  title,
  mode = 'text',
  variant = 'primary',
  textStyle,
  disabled,
  ...rest
}: Props) => {
  const props = useRestyle(restyleFunctions, rest)

  const getBackground = (): Colors | undefined => {
    if (disabled) return 'disabled'
    if (mode === 'contained') {
      if (variant === 'secondary') {
        return 'secondaryMain'
      }
      return 'primaryMain'
    }

    return undefined
  }

  const getTextColor = (): Colors => {
    if (mode === 'contained') {
      return 'primaryButtonText'
    }

    if (variant === 'secondary') {
      return 'secondaryText'
    }
    return 'purpleLight'
  }

  const getTextVariant = () => {
    if (mode === 'contained') return 'buttonBold'
    return 'buttonLight'
  }

  return (
    <TouchableOpacityBox
      backgroundColor={getBackground()}
      borderRadius="m"
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Text
        paddingVertical="lm"
        variant={getTextVariant()}
        color={getTextColor()}
        style={textStyle}
      >
        {title}
      </Text>
    </TouchableOpacityBox>
  )
}

export default Button
