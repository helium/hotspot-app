import React, { useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, SectionList } from 'react-native'
import { useSelector } from 'react-redux'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import appSlice from '../../../store/user/appSlice'
import useDevice from '../../../utils/useDevice'
import { MoreNavigationProp, MoreStackParamList } from '../moreTypes'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../../navigation/main/tabTypes'
import MoreListItem, { MoreListItemType } from './MoreListItem'
import useAuthIntervals from './useAuthIntervals'
import { useSpacing } from '../../../theme/themeHooks'

type Route = RouteProp<RootStackParamList & MoreStackParamList, 'MoreScreen'>
const MoreScreen = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const dispatch = useAppDispatch()
  const { version } = useDevice()
  const { app } = useSelector((state: RootState) => state)
  const authIntervals = useAuthIntervals()

  const navigation = useNavigation<MoreNavigationProp & RootNavigationProp>()
  const { l } = useSpacing()

  useEffect(() => {
    if (!params?.pinVerifiedFor) return

    const { pinVerifiedFor } = params

    switch (pinVerifiedFor) {
      case 'disablePin':
        dispatch(appSlice.actions.disablePin())
        break
      case 'disablePinForPayments':
        dispatch(appSlice.actions.requirePinForPayment(false))
        break
      case 'enablePinForPayments':
        dispatch(appSlice.actions.requirePinForPayment(true))
        break
      case 'resetPin':
        navigation.push('AccountCreatePinScreen', { pinReset: true })
    }
  }, [dispatch, params, navigation])

  const handlePinRequiredForPayment = useCallback(
    (value?: boolean) => {
      if (!app.isPinRequiredForPayment && value) {
        // toggling on
        navigation.push('LockScreen', {
          requestType: 'enablePinForPayments',
        })
      }

      if (app.isPinRequiredForPayment && !value) {
        // toggling off, confirm pin before turning off
        navigation.push('LockScreen', {
          requestType: 'disablePinForPayments',
        })
      }
    },
    [app.isPinRequiredForPayment, navigation],
  )

  const handlePinRequired = useCallback(
    (value?: boolean) => {
      if (!app.isPinRequired && value) {
        // toggling on
        navigation.push('AccountCreatePinScreen', { pinReset: true })
      }

      if (app.isPinRequired && !value) {
        // toggling off, confirm pin before turning off
        navigation.push('LockScreen', { requestType: 'disablePin' })
      }
    },
    [app.isPinRequired, navigation],
  )

  const handleResetPin = useCallback(() => {
    navigation.push('LockScreen', { requestType: 'resetPin' })
  }, [navigation])

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
            dispatch(appSlice.actions.signOut())
          },
        },
      ],
    )
  }, [t, dispatch])

  const handleIntervalSelected = useCallback(
    (value: string) => {
      dispatch(appSlice.actions.updateAuthInterval(parseInt(value, 10)))
    },
    [dispatch],
  )

  const SectionData = useMemo(() => {
    let pin: MoreListItemType[] = [
      {
        title: t('more.sections.security.enablePin'),
        onToggle: handlePinRequired,
        value: app.isPinRequired,
      },
    ]

    if (app.isPinRequired) {
      pin = [
        ...pin,
        {
          title: t('more.sections.security.requirePin'),
          value: app.authInterval || '',
          select: {
            items: authIntervals,
            onValueSelect: handleIntervalSelected,
          },
        },
        {
          title: t('more.sections.security.resetPin'),
          onPress: handleResetPin,
        },
        {
          title: t('more.sections.security.requirePinForPayments'),
          onToggle: handlePinRequiredForPayment,
          value: app.isPinRequiredForPayment,
        },
      ]
    }
    return [
      {
        title: t('more.sections.security.title'),
        data: pin,
      },
      // { title: t('more.sections.learn.title'), data: [] },
      // { title: t('more.sections.advanced.title'), data: [] },
      {
        title: t('more.sections.account.title'),
        data: [
          {
            title: t('more.sections.account.signOut'),
            onPress: handleSignOut,
            destructive: true,
          },
        ],
      },
      {
        title: t('more.sections.app.title'),
        data: [{ title: `v${version}` }],
      },
    ]
  }, [
    app,
    handleSignOut,
    version,
    handlePinRequiredForPayment,
    t,
    handlePinRequired,
    handleResetPin,
    authIntervals,
    handleIntervalSelected,
  ])

  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1}>
      <SectionList
        contentContainerStyle={{ paddingTop: l }}
        sections={SectionData}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => <MoreListItem item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            variant="body2"
            fontSize={12}
            paddingHorizontal="m"
            paddingVertical="s"
          >
            {title.toUpperCase()}
          </Text>
        )}
      />
    </SafeAreaBox>
  )
}

export default MoreScreen
