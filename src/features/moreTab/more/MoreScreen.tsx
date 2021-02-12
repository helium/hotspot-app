import React, { useCallback, useMemo, useEffect, memo } from 'react'
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
import accountSlice from '../../../store/account/accountSlice'
import connectedHotspotSlice from '../../../store/connectedHotspot/connectedHotspotSlice'
import heliumDataSlice from '../../../store/helium/heliumDataSlice'
import Security from '../../../assets/images/security.svg'
import Learn from '../../../assets/images/learn.svg'
import Account from '../../../assets/images/account.svg'
import Box from '../../../components/Box'
import DiscordItem from './DiscordItem'
import AppInfoItem from './AppInfoItem'
import activitySlice from '../../../store/activity/activitySlice'
import hotspotsSlice from '../../../store/hotspots/hotspotsSlice'
import { useLanguage } from '../../../utils/i18n'

type Route = RouteProp<RootStackParamList & MoreStackParamList, 'MoreScreen'>
const MoreScreen = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const dispatch = useAppDispatch()
  const { version } = useDevice()
  const { app } = useSelector((state: RootState) => state)
  const authIntervals = useAuthIntervals()
  const { changeLanguage, language } = useLanguage()
  const navigation = useNavigation<MoreNavigationProp & RootNavigationProp>()
  const spacing = useSpacing()

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
        break
      case 'revealWords':
        navigation.push('RevealWordsScreen')
        break
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
            dispatch(accountSlice.actions.signOut())
            dispatch(activitySlice.actions.signOut())
            dispatch(hotspotsSlice.actions.signOut())
            dispatch(connectedHotspotSlice.actions.signOut())
            dispatch(heliumDataSlice.actions.signOut())
          },
        },
      ],
    )
  }, [t, dispatch])

  const handleLanguageChange = useCallback(
    (lng: string) => {
      changeLanguage(lng)
    },
    [changeLanguage],
  )

  const handleIntervalSelected = useCallback(
    (value: string) => {
      dispatch(appSlice.actions.updateAuthInterval(parseInt(value, 10)))
    },
    [dispatch],
  )

  const handleRevealWords = useCallback(() => {
    if (app.isPinRequired) {
      navigation.push('LockScreen', { requestType: 'revealWords' })
    } else {
      navigation.push('RevealWordsScreen')
    }
  }, [app.isPinRequired, navigation])

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

    pin = [
      ...pin,
      {
        title: t('more.sections.security.revealWords'),
        onPress: handleRevealWords,
      },
    ]
    return [
      {
        title: t('more.sections.security.title'),
        icon: <Security />,
        data: pin,
      },
      {
        title: t('more.sections.learn.title'),
        icon: <Learn />,
        data: [
          {
            title: t('more.sections.learn.tokenEarnings'),
            openUrl: 'https://docs.helium.com',
          },
          {
            title: t('more.sections.learn.hotspotPlacement'),
            openUrl: 'https://docs.helium.com',
          },
          {
            title: t('more.sections.learn.support'),
            openUrl: 'https://docs.helium.com',
          },
          {
            title: t('more.sections.learn.troubleshooting'),
            openUrl: 'https://docs.helium.com',
          },
        ],
        footer: <DiscordItem />,
      },
      {
        title: t('more.sections.account.title'),
        icon: <Account />,
        data: [
          {
            title: t('more.sections.account.language'),
            value: language,
            select: {
              items: [
                { label: 'English', value: 'en' },
                { label: 'Chinese', value: 'zh' },
                { label: 'Japanese', value: 'ja' },
                { label: 'Korean', value: 'ko' },
              ],
              onValueSelect: handleLanguageChange,
            },
          },
          {
            title: t('more.sections.account.signOut'),
            onPress: handleSignOut,
            destructive: true,
          },
        ],
        footer: <AppInfoItem version={version} />,
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
    handleRevealWords,
    handleLanguageChange,
    language,
  ])

  return (
    <SafeAreaBox backgroundColor="primaryBackground">
      <Text variant="h3" marginVertical="m" paddingHorizontal="l">
        {t('more.title')}
      </Text>
      <SectionList
        contentContainerStyle={{
          paddingHorizontal: spacing.m,
          paddingBottom: spacing.xxl,
        }}
        sections={SectionData}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item, index, section }) => (
          <MoreListItem
            item={item}
            isTop={index === 0}
            isBottom={index === section.data.length - 1}
          />
        )}
        renderSectionHeader={({ section: { title, icon } }) => (
          <Box
            flexDirection="row"
            alignItems="center"
            paddingTop="l"
            paddingBottom="s"
            paddingHorizontal="xs"
            backgroundColor="primaryBackground"
          >
            {icon !== undefined && icon}
            <Text variant="body1Bold" marginLeft="s">
              {title}
            </Text>
          </Box>
        )}
        renderSectionFooter={({ section: { footer } }) => footer}
      />
    </SafeAreaBox>
  )
}

export default memo(MoreScreen)
