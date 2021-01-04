import React, { useRef, useEffect } from 'react'
import { Animated } from 'react-native'
import ImageBox from '../../components/ImageBox'
import HeliumLogo from '../../assets/images/heliumLogo.svg'
import AnimatedBox from '../../components/AnimatedBox'

const SplashScreen = () => {
  const anim = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(anim.current, { toValue: 1, useNativeDriver: true }).start()
  }, [])

  return (
    <AnimatedBox
      flex={1}
      justifyContent="center"
      alignItems="center"
      opacity={anim.current}
      flexDirection="row"
    >
      <ImageBox
        position="absolute"
        source={require('../../assets/images/map.png')}
      />
      <HeliumLogo />
    </AnimatedBox>
  )
}

export default SplashScreen
