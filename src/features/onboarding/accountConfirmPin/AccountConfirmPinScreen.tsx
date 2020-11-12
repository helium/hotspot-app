import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import Text from '../../../components/Text'
import EnterPin from '../../../assets/images/enter-pin.svg'
import SafeAreaBox from '../../../components/SafeAreaBox'
import PinDisplay from '../../../components/PinDisplay'
import Keypad from '../../../components/Keypad'
import {
  OnboardingNavigationProp,
  OnboardingStackParamList,
} from '../onboardingTypes'

type Route = RouteProp<OnboardingStackParamList, 'AccountConfirmPinScreen'>

const AccountConfirmPinScreen = () => {
  const navigation = useNavigation<OnboardingNavigationProp>()
  const route = useRoute<Route>()
  const { pin: originalPin } = route.params

  const { t } = useTranslation()
  const [pin, setPin] = useState('')

  const pinSuccess = useCallback(() => {
    if (!route.params.fromImport && !route.params.pinReset) {
      navigation.push('HotspotEducationScreen')
    }
  }, [navigation, route])

  const pinFailure = useCallback(() => {
    // TODO: don't nav back. Shake anim and clear pin?
    navigation.goBack()
  }, [navigation])

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

      <Text variant="body" marginBottom={{ smallPhone: 'm', phone: 'xl' }}>
        {t('account_setup.confirm_pin.subtitle')}
      </Text>
      <PinDisplay length={pin.length} />
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
