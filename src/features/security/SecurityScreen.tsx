import React, { useEffect, memo, useRef, useMemo, useState } from 'react'
import { Animated, ImageStyle, Image } from 'react-native'

const AnimatedImage = Animated.createAnimatedComponent(Image)

type Props = { visible: boolean }
const SecurityScreen = ({ visible }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0))
  const [mounted, setMounted] = useState(false)

  const fadeIn = () => {
    setMounted(true)
    Animated.timing(fadeAnim.current, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  const fadeOut = () => {
    Animated.timing(fadeAnim.current, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMounted(false))
  }

  useEffect(() => {
    if (mounted) {
      fadeIn()
    }
  }, [mounted])

  useEffect(() => {
    if (visible) {
      setMounted(true)
    } else {
      fadeOut()
    }
  }, [visible])

  const style = useMemo(
    () =>
      ({
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        height: '100%',
        opacity: fadeAnim.current,
      } as Animated.AnimatedProps<ImageStyle>),
    [],
  )

  if (!mounted) return null
  return (
    <AnimatedImage
      style={style}
      source={require('../../assets/images/splash.png')}
    />
  )
}

export default memo(SecurityScreen)
