import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { OnboardingNavigationProp } from '../onboardingTypes'
import ConfirmWordsScreen from './ConfirmWordsScreen'

const AccountEnterPassphraseScreen = () => {
  const navigation = useNavigation<OnboardingNavigationProp>()

  const onWordsConfirmed = useCallback(
    () => navigation.push('AccountCreatePinScreen'),
    [navigation],
  )

  return <ConfirmWordsScreen onComplete={onWordsConfirmed} />
}

export default AccountEnterPassphraseScreen
