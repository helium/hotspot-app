import React, { useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { useStateWithCallbackLazy } from 'use-state-with-callback'
import * as LocalAuthentication from 'expo-local-authentication'
import SafeAreaBox from '../../components/SafeAreaBox'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../navigation/main/tabTypes'
import { getString } from '../../utils/account'
import ConfirmPinView from '../../components/ConfirmPinView'
import { MoreNavigationProp } from '../moreTab/moreTypes'
import { useAppDispatch } from '../../store/store'
import userSlice from '../../store/user/userSlice'

type Route = RouteProp<RootStackParamList, 'LockScreen'>

const LockScreen = () => {
  const { t } = useTranslation()
  const {
    params: { lock: shouldLock, requestType },
  } = useRoute<Route>()
  const rootNav = useNavigation<RootNavigationProp>()
  const moreNav = useNavigation<MoreNavigationProp>()
  const [locked, setLocked] = useStateWithCallbackLazy(shouldLock)
  const dispatch = useAppDispatch()

  const { result: pin } = useAsync(getString, ['userPin'])

  const handleSuccess = useCallback(() => {
    if (shouldLock) {
      setLocked(false, () => {
        rootNav.navigate('MainTabs', {
          pinVerifiedFor: requestType,
        })
      })
    } else {
      moreNav.navigate('MoreScreen', {
        pinVerifiedFor: requestType,
      })
    }
  }, [moreNav, requestType, rootNav, setLocked, shouldLock])

  const handleSignOut = useCallback(() => {
    Alert.alert(
      t('more.sections.account.signOutAlert.title'),
      t('more.sections.account.signOutAlert.body'),
      [
        {
          text: t('generic.cancel'),
          style: 'cancel',
        },
        {
          text: t('generic.ok'),
          style: 'destructive',
          onPress: () => {
            dispatch(userSlice.actions.signOut())
          },
        },
      ],
    )
  }, [t, dispatch])

  useEffect(() => {
    const unsubscribe = rootNav.addListener('beforeRemove', (e) => {
      if (locked) e.preventDefault()
    })

    return unsubscribe
  }, [rootNav, locked])

  useEffect(() => {
    const localAuth = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      if (!isEnrolled || !hasHardware) return

      const { success } = await LocalAuthentication.authenticateAsync()
      if (success) handleSuccess()
    }

    localAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SafeAreaBox
      backgroundColor="secondaryBackground"
      flex={1}
      padding="l"
      paddingBottom="none"
    >
      {pin && (
        <ConfirmPinView
          originalPin={pin}
          title={t('auth.title')}
          subtitle={t('auth.enter_current')}
          pinSuccess={handleSuccess}
          onCancel={shouldLock ? handleSignOut : moreNav.goBack}
        />
      )}
    </SafeAreaBox>
  )
}

export default LockScreen
