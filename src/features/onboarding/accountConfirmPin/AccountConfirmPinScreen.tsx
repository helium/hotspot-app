import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import SafeAreaBox from '../../../components/SafeAreaBox'
import {
  OnboardingNavigationProp,
  OnboardingStackParamList,
} from '../onboardingTypes'
import userSlice from '../../../store/user/userSlice'
import { useAppDispatch } from '../../../store/store'
import ConfirmPinView from '../../../components/ConfirmPinView'

type Route = RouteProp<OnboardingStackParamList, 'AccountConfirmPinScreen'>

const AccountConfirmPinScreen = () => {
  const navigation = useNavigation<OnboardingNavigationProp>()
  const dispatch = useAppDispatch()
  const route = useRoute<Route>()
  const { pin: originalPin, pinReset } = route.params
  const { t } = useTranslation()

  const pinSuccess = useCallback(
    (pin: string) => {
      dispatch(userSlice.actions.backupAccount(pin))
      if (pinReset) {
        // TODO: Handle pin reset complete
      }
    },
    [pinReset, dispatch],
  )

  return (
    <SafeAreaBox
      backgroundColor="mainBackground"
      flex={1}
      padding="l"
      paddingBottom="none"
    >
      <ConfirmPinView
        originalPin={originalPin}
        title={t('auth.title')}
        pinSuccess={pinSuccess}
        onCancel={navigation.goBack}
      />
    </SafeAreaBox>
  )
}

export default AccountConfirmPinScreen
