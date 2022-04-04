import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import ConfirmWordsScreen from '../onboarding/accountEnterPassphrase/ConfirmWordsScreen'
import appSlice from '../../store/user/appSlice'
import accountSlice from '../../store/account/accountSlice'
import activitySlice from '../../store/activity/activitySlice'
import hotspotsSlice from '../../store/hotspots/hotspotsSlice'
import validatorsSlice from '../../store/validators/validatorsSlice'
import connectedHotspotSlice from '../../store/connectedHotspot/connectedHotspotSlice'
import { useAppDispatch } from '../../store/store'
import { MoreNavigationProp } from './moreTypes'
import useAlert from '../../utils/useAlert'
import { RootState } from '../../store/rootReducer'
import { RootNavigationProp } from '../../navigation/main/tabTypes'

const ConfirmSignoutScreen = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigation = useNavigation<MoreNavigationProp & RootNavigationProp>()
  const { showOKCancelAlert } = useAlert()
  const isPinRequired = useSelector(
    (state: RootState) => state.app.isPinRequired,
  )

  const onWordsConfirmed = useCallback(() => {
    navigation.goBack()
    Alert.alert(
      t('more.sections.app.signOutAlert.title'),
      t('more.sections.app.signOutAlert.body'),
      [
        {
          text: t('generic.cancel'),
          style: 'cancel',
        },
        {
          text: t('more.sections.app.signOut'),
          style: 'destructive',
          onPress: () => {
            dispatch(appSlice.actions.signOut())
            dispatch(accountSlice.actions.signOut())
            dispatch(activitySlice.actions.signOut())
            dispatch(hotspotsSlice.actions.signOut())
            dispatch(validatorsSlice.actions.signOut())
            dispatch(connectedHotspotSlice.actions.signOut())
          },
        },
      ],
    )
  }, [dispatch, navigation, t])

  const onForgotWords = useCallback(async () => {
    navigation.goBack()
    const decision = await showOKCancelAlert({
      titleKey: 'more.sections.app.signOutForgot.title',
      messageKey: 'more.sections.app.signOutForgot.body',
    })
    if (!decision) return

    if (isPinRequired) {
      navigation.push('LockScreen', { requestType: 'revealWords' })
    } else {
      navigation.push('RevealWordsScreen')
    }
  }, [isPinRequired, navigation, showOKCancelAlert])

  return (
    <ConfirmWordsScreen
      title={t('account_setup.confirm.titleSignOut')}
      onComplete={onWordsConfirmed}
      onForgotWords={onForgotWords}
    />
  )
}

export default ConfirmSignoutScreen
