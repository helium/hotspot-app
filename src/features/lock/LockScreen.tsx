import React, { useEffect } from 'react'
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

type Route = RouteProp<RootStackParamList, 'LockScreen'>

const LockScreen = () => {
  const { t } = useTranslation()
  const {
    params: { lock: shouldLock, requestType },
  } = useRoute<Route>()
  const rootNav = useNavigation<RootNavigationProp>()
  const moreNav = useNavigation<MoreNavigationProp>()
  const [locked, setLocked] = useStateWithCallbackLazy(shouldLock)

  const { result: pin } = useAsync(getString, ['userPin'])

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
          onCancel={shouldLock ? undefined : moreNav.goBack}
        />
      )}
    </SafeAreaBox>
  )
}

export default LockScreen
