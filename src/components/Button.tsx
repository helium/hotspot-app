/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { TextStyle } from 'react-native'
import { BoxProps } from '@shopify/restyle'

import Text from './Text'
import { Colors, Theme } from '../theme/theme'
import TouchableOpacityBox from './TouchableOpacityBox'
import Box from './Box'

type Props = BoxProps<Theme> & {
  mode?: 'text' | 'contained'
  variant?: ButtonVariant
  onPress?: () => void
  disabled?: boolean
  title: string
  textStyle?: TextStyle
  color?: Colors
}

type ButtonVariant = 'primary' | 'secondary' | 'destructive'

const Button = ({
  onPress,
  title,
  mode = 'text',
  variant = 'primary',
  color,
  textStyle,
  disabled,
  height,
  ...rest
}: Props) => {
  const getBackground = (): Colors | undefined => {
    if (mode === 'contained') {
      switch (variant) {
        case 'primary':
          return 'primaryMain'
        case 'secondary':
          return 'secondaryMain'
        case 'destructive':
          return 'purpleMuted'
      }
    }

    return undefined
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
      >
        <Text
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
