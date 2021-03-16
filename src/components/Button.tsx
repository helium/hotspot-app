/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { TextStyle } from 'react-native'
import { BoxProps } from '@shopify/restyle'

import Text from './Text'
import { Colors, Theme } from '../theme/theme'
import TouchableOpacityBox from './TouchableOpacityBox'
import Box from './Box'
import WithDebounce from './WithDebounce'

type Props = BoxProps<Theme> & {
  mode?: 'text' | 'contained'
  variant?: ButtonVariant
  onPress?: () => void
  disabled?: boolean
  title?: string
  textStyle?: TextStyle
  color?: Colors
  icon?: Element
}

type ButtonVariant = 'primary' | 'secondary' | 'destructive'

const containedBackground = {
  primary: 'primaryMain',
  secondary: 'secondaryMain',
  destructive: 'purpleMuted',
} as Record<string, Colors>

const Button = ({
  onPress,
  title,
  mode = 'text',
  variant = 'primary',
  color,
  textStyle,
  disabled,
  height,
  icon,
  ...rest
}: Props) => {
  const getBackground = (): Colors | undefined => {
    if (mode !== 'contained') return undefined
    return containedBackground[variant]
  }

  const getTextColor = (): Colors => {
    if (color) return color

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
    return 'buttonMedium'
  }

  return (
    <Box style={{ opacity: disabled ? 0.2 : 1 }} {...rest} height={height}>
      <TouchableOpacityBox
        height={height}
        backgroundColor={getBackground()}
        borderRadius="m"
        onPress={onPress}
        disabled={disabled}
        justifyContent="center"
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="m"
      >
        {icon && <Box marginEnd="s">{icon}</Box>}
        <Text
          maxFontSizeMultiplier={1.2}
          alignSelf="center"
          paddingVertical={height ? undefined : 'lm'}
          variant={getTextVariant()}
          color={getTextColor()}
          style={textStyle}
        >
          {title}
        </Text>
      </TouchableOpacityBox>
    </Box>
  )
}

export default Button

export const DebouncedButton = WithDebounce(Button)
