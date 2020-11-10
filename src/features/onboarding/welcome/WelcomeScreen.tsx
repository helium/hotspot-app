import React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import { OnboardingNavigationProp } from '../onboardingTypes'
import UserLocationMap from '../../../components/UserLocationMap'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Box from '../../../components/Box'
import HeliumLogo from '../../../assets/images/logo.svg'

const WelcomeScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()

  return (
    <View>
      <UserLocationMap />
      <SafeAreaBox
        height="100%"
        width="100%"
        paddingVertical="s"
        paddingHorizontal="xl"
      >
        <Box
          flexDirection="column"
          alignItems="center"
          width="100%"
          flex={3}
          marginTop="xl"
          justifyContent="flex-start"
        >
          <HeliumLogo />
        </Box>
        <Box
          flexDirection="column"
          alignItems="center"
          width="100%"
          flex={4}
          justifyContent="center"
        >
          <Text variant="header" numberOfLines={1} adjustsFontSizeToFit>
            {t('account_setup.welcome.title')}
          </Text>
          <Text variant="body" textAlign="center" marginVertical="m">
            {t('account_setup.welcome.subtitle')}
          </Text>
          <Text variant="bodyBold" textAlign="center">
            {t('account_setup.welcome.get_started')}
          </Text>
        </Box>
        <Box
          flexDirection="column"
          alignItems="center"
          width="100%"
          flex={3}
          justifyContent="flex-end"
        >
          <Button
            mode="contained"
            variant="primary"
            width="100%"
            marginBottom="l"
            onPress={() => navigation.push('AccountPassphraseWarning')}
            title={t('account_setup.welcome.create_account')}
          />
          <Button
            onPress={() => navigation.push('AccountPassphraseWarning')}
            mode="text"
            variant="primary"
            title={t('account_setup.welcome.import_account')}
          />
        </Box>
      </SafeAreaBox>
    </View>
  )
}

export default WelcomeScreen
