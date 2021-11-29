import React, { useEffect, memo, useRef, useMemo, useState } from 'react'
import { Animated, ImageStyle, Image, Platform } from 'react-native'
import Box from '../../components/Box'

const AnimatedImage = Animated.createAnimatedComponent(Image)

type Props = { visible: boolean }
const SecurityScreen = ({ visible }: Props) => {
  const fadeAnim = useRef(new Animated.Value(0))
  const [mounted, setMounted] = useState(false)

  const fadeIn = () => {
    setMounted(true)
    Animated.timing(fadeAnim.current, {
      toValue: 1,
      duration: 100,
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
        opacity: fadeAnim.current,
        height: '100%',
        width: '100%',
      } as Animated.AnimatedProps<ImageStyle>),
    [],
  )

  if (Platform.OS === 'android' || !mounted) {
    // android ui doesn't update after "background" is detected in RN.
    // We're using WindowManager.LayoutParams.FLAG_SECURE in
    // MainActivity.java to hide the view.

    return null
  }

  return (
    <Box position="absolute" top={0} left={0} right={0} bottom={0}>
      <AnimatedImage
        style={style}
        source={require('../../assets/images/SplashScreen.png')}
      />
    </Box>
  )
}

export default memo(SecurityScreen)
