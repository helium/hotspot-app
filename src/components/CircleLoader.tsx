/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useEffect } from 'react'
import { Animated, Easing } from 'react-native'
import { BoxProps } from '@shopify/restyle'
import Box from './Box'
import { Theme } from '../theme/theme'
import Text from './Text'

type Props = BoxProps<Theme> & { text?: string }
const CircleLoader = ({ text, minHeight, ...props }: Props) => {
  const rotateAnim = useRef(new Animated.Value(0))
  const opacityAnim = useRef(new Animated.Value(0))

  const anim = () => {
    Animated.loop(
      Animated.timing(rotateAnim.current, {
        toValue: -1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start()

    Animated.timing(opacityAnim.current, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    const scan = async () => {
      anim()
    }
    scan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box
      {...props}
      overflow="hidden"
      minHeight={minHeight || 30}
      alignItems="center"
    >
      <Animated.Image
        source={require('../assets/images/circleLoader.png')}
        resizeMode="contain"
        style={{
          flex: 1,
          maxHeight: 105,
          opacity: opacityAnim.current,
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
      {text && (
        <Text
          textAlign="center"
          variant="body2Light"
          marginTop="xl"
          color="grayDark"
          textTransform="uppercase"
        >
          {text}
        </Text>
      )}
    </Box>
  )
}

export default CircleLoader
