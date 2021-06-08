import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, SectionList } from 'react-native'
import { useSelector } from 'react-redux'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { isEqual } from 'lodash'
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
import { useLanguageContext } from '../../../providers/LanguageProvider'
import { EXPLORER_BASE_URL } from '../../../utils/config'
import { SUPPORTED_LANGUAGUES } from '../../../utils/i18n/i18nTypes'
import Articles from '../../../constants/articles'

type Route = RouteProp<RootStackParamList & MoreStackParamList, 'MoreScreen'>
const MoreScreen = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const dispatch = useAppDispatch()
  const { version } = useDevice()
  const app = useSelector((state: RootState) => state.app, isEqual)
  const authIntervals = useAuthIntervals()
  const { changeLanguage, language } = useLanguageContext()
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

  const handleConvertHntToCurrency = useCallback(() => {
    dispatch(
      appSlice.actions.updateConvertHntToCurrency(!app.convertHntToCurrency),
    )
  }, [dispatch, app.convertHntToCurrency])

  const handleHaptic = useCallback(() => {
    dispatch(appSlice.actions.updateHapticEnabled(!app.isHapticDisabled))
  }, [dispatch, app.isHapticDisabled])

  const handleSignOut = useCallback(() => {
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
            openUrl: Articles.Token_Earnings,
          },
          {
            title: t('more.sections.learn.heliumtoken'),
            openUrl: Articles.Helium_Token,
          },
          {
            title: t('more.sections.learn.coverage'),
            openUrl: `${EXPLORER_BASE_URL}/coverage`,
          },
          {
            title: t('more.sections.learn.troubleshooting'),
            openUrl: Articles.Docs_Root,
          },
        ],
        footer: <DiscordItem />,
      },
      {
        title: t('more.sections.app.title'),
        icon: <Account />,
        data: [
          {
            title: t('more.sections.app.language'),
            value: language,
            select: {
              items: SUPPORTED_LANGUAGUES,
              onValueSelect: handleLanguageChange,
            },
          },
          {
            title: t('more.sections.app.enableHapticFeedback'),
            onToggle: handleHaptic,
            value: !app.isHapticDisabled,
          },
          {
            title: t('more.sections.app.convertHntToCurrency'),
            onToggle: handleConvertHntToCurrency,
            value: app.convertHntToCurrency,
          },
          {
            title: t('more.sections.app.signOut'),
            onPress: handleSignOut,
            destructive: true,
          },
        ],
        footer: <AppInfoItem version={version} />,
      },
    ]
  }, [
    t,
    handlePinRequired,
    app.isPinRequired,
    app.isHapticDisabled,
    app.convertHntToCurrency,
    app.authInterval,
    app.isPinRequiredForPayment,
    handleRevealWords,
    language,
    handleLanguageChange,
    handleHaptic,
    handleConvertHntToCurrency,
    handleSignOut,
    version,
    authIntervals,
    handleIntervalSelected,
    handleResetPin,
    handlePinRequiredForPayment,
  ])

  const contentContainer = useMemo(
    () => ({
      paddingHorizontal: spacing.m,
      paddingBottom: spacing.xxxl,
    }),
    [spacing.m, spacing.xxxl],
  )

  return (
    <SafeAreaBox backgroundColor="primaryBackground">
      <Text variant="h3" marginVertical="m" paddingHorizontal="l">
        {t('more.title')}
      </Text>
      <SectionList
        contentContainerStyle={contentContainer}
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
