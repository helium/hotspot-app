import React, { useEffect, useRef } from 'react'
import { Animated, Easing, ImageSourcePropType } from 'react-native'
import Box from '../Box'

const RingLoader = ({
  duration = 2000,
  size = 212,
  color = 'purple',
}: {
  duration?: number
  size?: number
  color?: 'purple' | 'green'
}) => {
  const rotateAnim = useRef(new Animated.Value(0))

  const images: Record<string, ImageSourcePropType> = {
    purple: {
      outer: require('../../assets/images/ring-loader-purple.png'),
      inner: require('../../assets/images/ring-loader-inner-purple.png'),
    },
    green: {
      outer: require('../../assets/images/ring-loader-green.png'),
      inner: require('../../assets/images/ring-loader-inner-green.png'),
    },
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
        source={images[color].outer}
        style={{
          position: 'absolute',
          height: size,
          width: size,
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
      <Animated.Image
        source={images[color].inner}
        style={{
          height: size,
          width: size,
          transform: [
            {
              rotate: rotateAnim.current.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}
      />
    </Box>
  )
}

export default RingLoader
