import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import Text from '../../../components/Text'
import EnterPin from '../../../assets/images/enter-pin.svg'
import SafeAreaBox from '../../../components/SafeAreaBox'
import PinDisplay from '../../../components/PinDisplay'
import Keypad from '../../../components/Keypad'
import {
  OnboardingNavigationProp,
  OnboardingStackParamList,
} from '../onboardingTypes'

type Route = RouteProp<OnboardingStackParamList, 'AccountCreatePinScreen'>
const AccountCreatePinScreen = () => {
  const { t } = useTranslation()
  const route = useRoute<Route>()
  const navigation = useNavigation<OnboardingNavigationProp>()

  const [pin, setPin] = useState('')

  useEffect(() => {
    if (pin.length === 6) {
      navigation.push('AccountConfirmPinScreen', {
        pin,
        fromImport: route.params?.fromImport,
        pinReset: route.params?.pinReset,
      })
    }
  }, [pin, navigation, route])

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
        {t('account_setup.create_pin.title')}
      </Text>

      <Text variant="bodyLight" marginBottom={{ smallPhone: 'm', phone: 'xl' }}>
        {t('account_setup.create_pin.subtitle')}
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

export default AccountCreatePinScreen
