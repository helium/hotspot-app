/* eslint-disable react/jsx-props-no-spreading */
import { BoxProps } from '@shopify/restyle'
import React, { useRef } from 'react'
import {
  Animated,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  Easing,
  GestureResponderEvent,
} from 'react-native'
import { Theme } from '../theme/theme'
import Box from './Box'

type Props = BoxProps<Theme> &
  TouchableWithoutFeedbackProps & { children: React.ReactNode }

const AnimatedBox = Animated.createAnimatedComponent(Box)

const TouchableCircle = ({ children, onPressIn, ...rest }: Props) => {
  const anim = useRef(new Animated.Value(0))

  const setOpacityTo = (value: number, duration: number) =>
    Animated.timing(anim.current, {
      toValue: value,
      duration,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    })

  const handlePressIn = (e: GestureResponderEvent) => {
    Animated.sequence([setOpacityTo(1, 50), setOpacityTo(0, 100)]).start()
    onPressIn?.(e)
  }

  return (
    <Box {...rest}>
      <TouchableWithoutFeedback onPressIn={handlePressIn}>
        <Box
          justifyContent="center"
          alignItems="center"
          position="relative"
          height={{ phone: 80, smallPhone: 60 }}
          width={{ phone: 80, smallPhone: 60 }}
        >
          <AnimatedBox
            style={{ opacity: anim.current }}
            position="absolute"
            top={0}
            height="100%"
            width="100%"
            borderRadius="round"
            backgroundColor="white"
          />

          {children}
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

export default TouchableCircle
