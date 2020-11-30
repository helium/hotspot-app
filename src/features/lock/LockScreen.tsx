import React, { useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useAsync } from 'react-async-hook'
import { useStateWithCallbackLazy } from 'use-state-with-callback'
import SafeAreaBox from '../../components/SafeAreaBox'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../navigation/mainTabs/tabTypes'
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
          pinSuccess={() => {
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
          }}
          onCancel={shouldLock ? handleSignOut : moreNav.goBack}
        />
      )}
    </SafeAreaBox>
  )
}

export default LockScreen
