import React, { useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import EmojiBlip from '../../../components/EmojiBlip'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

const OnboardingErrorScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()

  const navNext = useCallback(() => {
    navigation.navigate('MainTabs')
  }, [navigation])

  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1} padding="l">
      <Box flex={1} justifyContent="center" paddingBottom="xxl">
        <Box paddingBottom="l">
          <EmojiBlip name="exploding_head" />
        </Box>

        <Text variant="h1">{t('hotspot_setup.onboarding_error.title')}</Text>
        <Text variant="body1" marginVertical="l">
          {t('hotspot_setup.onboarding_error.subtitle')}
        </Text>
      </Box>
      <Box>
        <Button
          mode="contained"
          variant="primary"
          title={t('hotspot_setup.onboarding_error.next')}
          onPress={navNext}
        />
      </Box>
    </SafeAreaBox>
  )
}

export default OnboardingErrorScreen
