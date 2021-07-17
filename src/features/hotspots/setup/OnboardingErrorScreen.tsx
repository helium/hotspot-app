import React, { useCallback, useMemo } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import { DebouncedButton } from '../../../components/Button'
import EmojiBlip from '../../../components/EmojiBlip'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import { HotspotSetupStackParamList } from './hotspotSetupTypes'

type Route = RouteProp<HotspotSetupStackParamList, 'OnboardingErrorScreen'>
const OnboardingErrorScreen = () => {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation<RootNavigationProp>()
  const {
    params: { connectStatus },
  } = useRoute<Route>()
  const navNext = useCallback(() => {
    navigation.navigate('MainTabs')
  }, [navigation])

  const subtitle = useMemo(() => {
    let subtitleKey = `hotspot_setup.onboarding_error.subtitle.${connectStatus}`

    if (!i18n.exists(subtitleKey)) {
      subtitleKey =
        'hotspot_setup.onboarding_error.subtitle.something_went_wrong'
    }
    return t(subtitleKey)
  }, [connectStatus, i18n, t])

  return (
    <SafeAreaBox backgroundColor="primaryBackground" flex={1} padding="l">
      <Box flex={1} justifyContent="center" paddingBottom="xxl">
        <Box paddingBottom="l">
          <EmojiBlip name="exploding_head" />
        </Box>

        <Text variant="h1">{t('hotspot_setup.onboarding_error.title')}</Text>
        <Text variant="body1" marginVertical="l">
          {subtitle}
        </Text>
        <Text variant="body2" marginVertical="l">
          {connectStatus}
        </Text>
      </Box>
      <Box>
        <DebouncedButton
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
