import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Animated } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import EnterPin from '../assets/images/enter-pin.svg'
import Text from './Text'
import PinDisplay from './PinDisplay'
import Keypad from './Keypad'
import haptic from '../utils/haptic'
import Box from './Box'

type Props = {
  originalPin: string
  title: string
  subtitle: string
  pinSuccess: (pin: string) => void
  onCancel?: () => void
}
const ConfirmPinView = ({
  title,
  subtitle,
  pinSuccess,
  originalPin,
  onCancel,
}: Props) => {
  const [pin, setPin] = useState('')
  const shakeAnim = useRef(new Animated.Value(0))
  const navigation = useNavigation()
  const pinFailure = useCallback(() => {
    const { current } = shakeAnim
    const move = (direction: 'left' | 'right' | 'center') => {
      let value = 0
      if (direction === 'left') value = -15
      if (direction === 'right') value = 15
      return Animated.timing(current, {
        toValue: value,
        duration: 85,
        useNativeDriver: true,
      })
    }

    Animated.sequence([
      move('left'),
      move('right'),
      move('left'),
      move('right'),
      move('center'),
    ]).start(() => setPin(''))

    haptic()
  }, [])

  useEffect(() => {
    if (pin.length === 6) {
      if (originalPin === pin) {
        pinSuccess(pin)
      } else {
        pinFailure()
      }
    }
  }, [pin, navigation, originalPin, pinSuccess, pinFailure])

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setPin('')
    })

    return unsubscribe
  }, [navigation])

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <EnterPin />
      <Text
        marginBottom="m"
        variant="header"
        marginTop={{ smallPhone: 'none', phone: 'xl' }}
      >
        {title}
      </Text>

      <Text variant="bodyLight" marginBottom={{ smallPhone: 'm', phone: 'xl' }}>
        {subtitle}
      </Text>
      <Animated.View style={{ transform: [{ translateX: shakeAnim.current }] }}>
        <PinDisplay length={pin.length} />
      </Animated.View>
      <Keypad
        onCancel={onCancel}
        onBackspacePress={() => {
          setPin((val) => val.slice(0, -1))
        }}
        onNumberPress={(num) => {
          setPin((val) => (val.length < 6 ? val + num : val))
        }}
      />
    </Box>
  )
}

export default ConfirmPinView
