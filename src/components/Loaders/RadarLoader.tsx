import React, { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import Box from '../Box'

const RadarLoader = ({
  duration = 2000,
  color = 'purple',
}: {
  duration?: number
  color?: 'purple' | 'green'
}) => {
  const rotateAnim = useRef(new Animated.Value(0))

  const images: Record<string, any> = {
    purple: require('../../assets/images/radar-loader-purple.png'),
    green: require('../../assets/images/radar-loader-green.png'),
  }

  const anim = () =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim.current, {
          toValue: 1,
          duration,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(rotateAnim.current, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start()

  useEffect(() => {
    anim()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box flexDirection="row" justifyContent="center">
      <Animated.Image
        source={images[color]}
        style={{
          transform: [
            {
              rotate: rotateAnim.current.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-360deg'],
              }),
            },
          ],
        }}
      />
    </Box>
  )
}

export default RadarLoader
