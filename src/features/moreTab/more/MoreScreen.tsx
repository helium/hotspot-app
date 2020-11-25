import React, { useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, SectionList, Switch } from 'react-native'
import { useSelector } from 'react-redux'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import userSlice from '../../../store/user/userSlice'
import useDevice from '../../../utils/useDevice'
import { MoreNavigationProp, MoreStackParamList } from '../moreTypes'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../../navigation/mainTabs/tabTypes'

type SectionRow = {
  title: string
  destructive?: boolean
  onPress?: () => void
  onToggle?: (value: boolean) => void
  value?: boolean | string
}

type Route = RouteProp<RootStackParamList & MoreStackParamList, 'MoreScreen'>
const MoreScreen = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const dispatch = useAppDispatch()
  const { version } = useDevice()
  const { isPinRequired, isPinRequiredForPayment } = useSelector(
    (state: RootState) => state.user,
  )

  const navigation = useNavigation<MoreNavigationProp & RootNavigationProp>()

  useEffect(() => {
    if (!params?.pinVerifiedFor) return

    const { pinVerifiedFor } = params

    if (pinVerifiedFor === 'disablePin') {
      dispatch(userSlice.actions.disablePin())
    } else if (pinVerifiedFor === 'disablePinForPayments') {
      dispatch(userSlice.actions.requirePinForPayment(false))
    } else if (pinVerifiedFor === 'enablePinForPayments') {
      dispatch(userSlice.actions.requirePinForPayment(true))
    } else if (pinVerifiedFor === 'resetPin') {
      navigation.push('AccountCreatePinScreen', { pinReset: true })
    }
  }, [dispatch, params, navigation])

  const handlePinRequiredForPayment = useCallback(
    (value?: boolean) => {
      if (!isPinRequiredForPayment && value) {
        // toggling on
        navigation.push('VerifyPinScreen', {
          requestType: 'enablePinForPayments',
        })
      }

      if (isPinRequiredForPayment && !value) {
        // toggling off, confirm pin before turning off
        navigation.push('VerifyPinScreen', {
          requestType: 'disablePinForPayments',
        })
      }
    },
    [isPinRequiredForPayment, navigation],
  )

  const handlePinRequired = useCallback(
    (value?: boolean) => {
      if (!isPinRequired && value) {
        // toggling on
        navigation.push('AccountCreatePinScreen', { pinReset: true })
      }

      if (isPinRequired && !value) {
        // toggling off, confirm pin before turning off
        navigation.push('VerifyPinScreen', { requestType: 'disablePin' })
      }
    },
    [isPinRequired, navigation],
  )

  const handleResetPin = useCallback(() => {
    navigation.push('VerifyPinScreen', { requestType: 'resetPin' })
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
            dispatch(userSlice.actions.signOut())
          },
        },
      ],
    )
  }, [t, dispatch])

  const SectionData = useMemo(() => {
    let pin: SectionRow[] = [
      {
        title: t('more.sections.security.enablePin'),
        onToggle: handlePinRequired,
        value: isPinRequired,
      },
    ]

    if (isPinRequired) {
      pin = [
        ...pin,
        { title: t('more.sections.security.requirePin') },
        {
          title: t('more.sections.security.resetPin'),
          onPress: handleResetPin,
        },
        {
          title: t('more.sections.security.requirePinForPayments'),
          onToggle: handlePinRequiredForPayment,
          value: isPinRequiredForPayment,
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
    handleSignOut,
    version,
    isPinRequired,
    isPinRequiredForPayment,
    handlePinRequiredForPayment,
    t,
    handlePinRequired,
    handleResetPin,
  ])

  const Item = ({
    item: { title, value, destructive, onToggle, onPress },
  }: {
    item: SectionRow
  }) => (
    <TouchableOpacityBox
      flexDirection="row"
      justifyContent="space-between"
      backgroundColor="darkGray"
      padding="m"
      onPress={onPress}
      disabled={!onPress}
    >
      <Text variant="body" color={destructive ? 'red' : 'primaryText'}>
        {title}
      </Text>
      {onToggle && <Switch value={value as boolean} onValueChange={onToggle} />}
    </TouchableOpacityBox>
  )

  return (
    <SafeAreaBox backgroundColor="secondaryBackground" flex={1} paddingTop="xl">
      <SectionList
        sections={SectionData}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => <Item item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            variant="body"
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
