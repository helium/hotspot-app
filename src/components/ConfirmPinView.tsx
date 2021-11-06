import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import { Animated } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Text from './Text'
import PinDisplay from './PinDisplay'
import Keypad from './Keypad'
import useHaptic from '../utils/useHaptic'
import Box from './Box'
import TouchableOpacityBox from './TouchableOpacityBox'

type Props = {
  originalPin: string
  title: string
  subtitle: string
  pinSuccess: (pin: string) => void
  onCancel?: () => void
  clearable?: boolean
}
const ConfirmPinView = ({
  title,
  subtitle,
  pinSuccess,
  originalPin,
  onCancel,
  clearable,
}: Props) => {
  const { triggerImpact } = useHaptic()
  const success = useRef(false)
  const [pin, setPin] = useState('')
  const shakeAnim = useRef(new Animated.Value(0))
  const navigation = useNavigation()
  const { t } = useTranslation()

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

    triggerImpact()
  }, [triggerImpact])

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

  const handleBackspace = useCallback(() => {
    setPin((val) => val.slice(0, -1))
  }, [])

  const handleNumber = useCallback((num: number) => {
    setPin((val) => (val.length < 6 ? val + num : val))
  }, [])

  const handleClear = useCallback(() => {
    setPin('')
  }, [])

  return (
    <Box
      backgroundColor="primaryBackground"
      flex={1}
      paddingHorizontal="lx"
      justifyContent="center"
      alignItems="center"
    >
      <Box flex={1} />
      <Text marginBottom="m" variant="h1" maxFontSizeMultiplier={1}>
        {title}
      </Text>

      <Text variant="body1">{subtitle}</Text>
      <Animated.View style={{ transform: [{ translateX: shakeAnim.current }] }}>
        <PinDisplay length={pin.length} marginVertical="xl" />
      </Animated.View>
      <Keypad
        customButtonTitle={clearable ? t('generic.clear') : t('generic.cancel')}
        onCustomButtonPress={clearable ? handleClear : onCancel}
        onBackspacePress={handleBackspace}
        onNumberPress={handleNumber}
      />
      <Box flex={1} justifyContent="center">
        {clearable && onCancel && (
          <TouchableOpacityBox padding="l" onPress={onCancel}>
            <Text variant="body1">{t('more.sections.app.signOut')}</Text>
          </TouchableOpacityBox>
        )}
      </Box>
    </Box>
  )
}

export default memo(ConfirmPinView)
