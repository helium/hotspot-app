/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { BoxProps } from '@shopify/restyle'
import Box from './Box'
import { Theme } from '../theme/theme'

type Props = { progress: number } & BoxProps<Theme>
const AnimatedBox = Animated.createAnimatedComponent(Box)

const ProgressBar = ({ progress, ...props }: Props) => {
  const anim = useRef(new Animated.Value(0))
  const width = anim.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  })

  useEffect(() => {
    Animated.timing(anim.current, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start()
  }, [progress])

  return (
    <Box flexDirection="row" justifyContent="center" {...props}>
      <Box width="50%" height={8} borderRadius="m" overflow="hidden">
        <Box
          borderRadius="m"
          borderWidth={1}
          height="100%"
          width="100%"
          borderColor="white"
          position="absolute"
        />
        <AnimatedBox
          backgroundColor="white"
          height="100%"
          position="absolute"
          top={0}
          left={0}
          style={{ width }}
        />
      </Box>
    </Box>
  )
}

export default ProgressBar
