import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import {
  OnboardingNavigationProp,
  OnboardingStackParamList,
} from '../onboardingTypes'
import appSlice from '../../../store/user/appSlice'
import { useAppDispatch } from '../../../store/store'
import ConfirmPinView from '../../../components/ConfirmPinView'
import { MoreNavigationProp } from '../../moreTab/moreTypes'

type Route = RouteProp<OnboardingStackParamList, 'AccountConfirmPinScreen'>

const AccountConfirmPinScreen = () => {
  const dispatch = useAppDispatch()
  const route = useRoute<Route>()
  const navigation = useNavigation<
    MoreNavigationProp & OnboardingNavigationProp
  >()
  const { pin: originalPin, pinReset } = route.params
  const { t } = useTranslation()

  const pinSuccess = useCallback(
    (pin: string) => {
      dispatch(appSlice.actions.backupAccount(pin))
      if (pinReset) {
        // TODO: Handle pin reset complete
        navigation.navigate('MoreScreen')
      }
    },
    [pinReset, dispatch, navigation],
  )

  return (
    <ConfirmPinView
      originalPin={originalPin}
      title={t('account_setup.confirm_pin.title')}
      subtitle={t('account_setup.confirm_pin.subtitle')}
      pinSuccess={pinSuccess}
      onCancel={navigation.goBack}
    />
  )
}

export default AccountConfirmPinScreen
