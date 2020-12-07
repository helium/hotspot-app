import React, { useEffect, useRef } from 'react'
import { Animated } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import OneSignal from 'react-native-onesignal'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import EnableNotif from '../../../assets/enable-notif.svg'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Button from '../../../components/Button'
import { wp } from '../../../utils/layout'
import Notification from '../../../components/Notification'
import { EducationNavigationProp } from '../educationTypes'

const AnimatedBox = Animated.createAnimatedComponent(Box)

const EnableNotificationsScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<EducationNavigationProp>()
  const xPos = useRef(new Animated.Value(wp(100)))

  useEffect(() => {
    Animated.spring(xPos.current, {
      toValue: 0,
      delay: 700,
      bounciness: 8,
      speed: 2,
      useNativeDriver: false,
    }).start()
  }, [])

  const navNext = () => navigation.push('AccountEndSetupScreen')

  const checkNotificationPermissions = async () => {
    OneSignal.promptForPushNotificationsWithUserResponse(() => {
      navNext()
    })
  }

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      alignItems="center"
      paddingHorizontal="l"
      position="relative"
    >
      <Box paddingTop="l">
        <EnableNotif />
      </Box>
      <Box flex={1} marginTop="n_xl" width="100%">
        <Text variant="header" textAlign="center">
          {t('account_setup.enable_notifications.title')}
        </Text>
        <Text variant="bodyLight" textAlign="center">
          {t('account_setup.enable_notifications.subtitle')}
        </Text>
        <Box flex={1}>
          <AnimatedBox position="absolute" left={xPos.current} width="100%">
            <Notification date={new Date()} marginTop="xxl">
              {t('account_setup.enable_notifications.mining')}
            </Notification>
          </AnimatedBox>
        </Box>
        <Button
          onPress={checkNotificationPermissions}
          mode="contained"
          variant="secondary"
          title={t('account_setup.enable_notifications.title')}
        />
        <Button
          onPress={navNext}
          variant="secondary"
          title={t('account_setup.enable_notifications.later')}
        />
      </Box>
    </SafeAreaBox>
  )
}

export default EnableNotificationsScreen
