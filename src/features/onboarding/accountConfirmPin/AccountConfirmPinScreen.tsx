import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import { Animated } from 'react-native'
import Text from '../../../components/Text'
import EnterPin from '../../../assets/images/enter-pin.svg'
import SafeAreaBox from '../../../components/SafeAreaBox'
import PinDisplay from '../../../components/PinDisplay'
import Keypad from '../../../components/Keypad'
import {
  OnboardingNavigationProp,
  OnboardingStackParamList,
} from '../onboardingTypes'
import haptic from '../../../utils/haptic'
import userSlice from '../../../store/user/userSlice'
import { useAppDispatch } from '../../../store/store'

type Route = RouteProp<OnboardingStackParamList, 'AccountConfirmPinScreen'>

const AccountConfirmPinScreen = () => {
  const navigation = useNavigation<OnboardingNavigationProp>()
  const dispatch = useAppDispatch()
  const route = useRoute<Route>()
  const { pin: originalPin, pinReset } = route.params
  const { t } = useTranslation()
  const [pin, setPin] = useState('')
  const shakeAnim = useRef(new Animated.Value(0))

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

  const backup = useCallback(
    () => dispatch(userSlice.actions.backupAccount(pin)),
    [dispatch, pin],
  )

  const pinSuccess = useCallback(() => {
    backup()
    if (pinReset) {
      // TODO: Handle pin reset complete
    }
  }, [backup, pinReset])

  useEffect(() => {
    if (pin.length === 6) {
      if (originalPin === pin) {
        pinSuccess()
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
    <SafeAreaBox
      backgroundColor="mainBackground"
      flex={1}
      padding="l"
      paddingBottom="none"
      justifyContent="center"
      alignItems="center"
    >
      <EnterPin />
      <Text
        marginBottom="m"
        variant="header"
        marginTop={{ smallPhone: 'none', phone: 'xl' }}
      >
        {t('account_setup.confirm_pin.title')}
      </Text>

      <Text variant="bodyLight" marginBottom={{ smallPhone: 'm', phone: 'xl' }}>
        {t('account_setup.confirm_pin.subtitle')}
      </Text>
      <Animated.View style={{ transform: [{ translateX: shakeAnim.current }] }}>
        <PinDisplay length={pin.length} />
      </Animated.View>
      <Keypad
        onBackspacePress={() => {
          setPin((val) => val.slice(0, -1))
        }}
        onNumberPress={(num) => {
          setPin((val) => (val.length < 6 ? val + num : val))
        }}
      />
    </SafeAreaBox>
  )
}

export default AccountConfirmPinScreen
