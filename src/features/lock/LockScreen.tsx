import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { useStateWithCallbackLazy } from 'use-state-with-callback'
import * as LocalAuthentication from 'expo-local-authentication'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../navigation/main/tabTypes'
import { getSecureItem } from '../../utils/secureAccount'
import ConfirmPinView from '../../components/ConfirmPinView'
import { MoreNavigationProp } from '../moreTab/moreTypes'
import { useAppDispatch } from '../../store/store'
import appSlice from '../../store/user/appSlice'
import SafeAreaBox from '../../components/SafeAreaBox'
import { SendNavigationProps } from '../wallet/send/sendTypes'

type Route = RouteProp<RootStackParamList, 'LockScreen'>

const LockScreen = () => {
  const { t } = useTranslation()
  const {
    params: { lock: shouldLock, requestType, sendParams },
  } = useRoute<Route>()
  const rootNav = useNavigation<RootNavigationProp>()
  const moreNav = useNavigation<MoreNavigationProp>()
  const sendNav = useNavigation<SendNavigationProps>()
  const [locked, setLocked] = useStateWithCallbackLazy(shouldLock)
  const dispatch = useAppDispatch()
  const passedSendParams = useMemo(() => sendParams || {}, [sendParams])

  const { result: pin } = useAsync(getSecureItem, ['userPin'])

  const handleSuccess = useCallback(() => {
    if (shouldLock) {
      setLocked(false, () => {
        dispatch(appSlice.actions.lock(false))
        rootNav.goBack()
      })
    } else if (requestType === 'send') {
      sendNav.navigate('Send', { pinVerified: 'pass', ...passedSendParams })
    } else {
      moreNav.navigate('MoreScreen', {
        pinVerifiedFor: requestType,
      })
    }
  }, [
    shouldLock,
    requestType,
    setLocked,
    dispatch,
    rootNav,
    sendNav,
    passedSendParams,
    moreNav,
  ])

  const handleSignOut = useCallback(() => {
    Alert.alert(
      t('more.sections.app.signOutAlert.title'),
      t('more.sections.app.signOutAlert.body'),
      [
        {
          text: t('more.sections.app.signOut'),
          style: 'destructive',
          onPress: () => {
            dispatch(appSlice.actions.signOut())
          },
        },
        {
          text: t('generic.cancel'),
          style: 'cancel',
        },
      ],
    )
  }, [t, dispatch])

  const handleCancel = useCallback(() => {
    if (shouldLock) {
      handleSignOut()
    } else if (requestType === 'send') {
      sendNav.navigate('Send', { pinVerified: 'fail', ...passedSendParams })
    } else {
      rootNav.goBack()
    }
  }, [
    handleSignOut,
    requestType,
    rootNav,
    sendNav,
    passedSendParams,
    shouldLock,
  ])

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
    <SafeAreaBox backgroundColor="primaryBackground" flex={1}>
      <ConfirmPinView
        originalPin={pin || ''}
        title={t('auth.title')}
        subtitle={t('auth.enter_current')}
        pinSuccess={handleSuccess}
        onCancel={handleCancel}
        clearable={requestType === 'unlock'}
      />
    </SafeAreaBox>
  )
}

export default memo(LockScreen)
