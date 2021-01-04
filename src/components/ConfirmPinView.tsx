import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Animated } from 'react-native'
import { useNavigation } from '@react-navigation/native'
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
  const success = useRef(false)
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
        success.current = true
        pinSuccess(pin)
      } else {
        pinFailure()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin])

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setPin('')
    })

    return unsubscribe
  }, [navigation])

  return (
    <Box
      backgroundColor="primaryBackground"
      flex={1}
      paddingHorizontal="lx"
      justifyContent="center"
      alignItems="center"
    >
      <Box flex={1} />
      <Text marginBottom="m" variant="h1">
        {title}
      </Text>

      <Text variant="body1">{subtitle}</Text>
      <Animated.View style={{ transform: [{ translateX: shakeAnim.current }] }}>
        <PinDisplay length={pin.length} marginVertical="xl" />
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
      <Box flex={1} />
    </Box>
  )
}

export default ConfirmPinView
