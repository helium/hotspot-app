import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import BackButton from '../../../components/BackButton'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import Lock from '../../../assets/images/lock.svg'
import Box from '../../../components/Box'
import TextTransform from '../../../components/TextTransform'
import WordGraph from '../../../assets/images/wordGraph.svg'
import Button from '../../../components/Button'
import { OnboardingNavigationProp } from '../onboardingTypes'

const AccountPassphraseWarningScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()
  return (
    <Box flex={1} backgroundColor="primaryBackground">
      <Box position="absolute" right={0}>
        <Lock />
      </Box>

      <SafeAreaBox flex={1} flexDirection="column" paddingHorizontal="l">
        <BackButton onPress={navigation.goBack} paddingHorizontal="none" />
        <Text
          marginTop={{ smallPhone: 's', phone: 'xl' }}
          variant="header"
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {t('account_setup.warning.title')}
        </Text>
        <TextTransform
          marginVertical="xl"
          variant="bodyLight"
          i18nKey="account_setup.warning.subtitle"
        />
        <WordGraph />
        <Text marginTop="xl" variant="bodyLight">
          {t('account_setup.warning.recover')}
        </Text>
        <Box flex={1} justifyContent="flex-end">
          <Button
            mode="contained"
            variant="primary"
            width="100%"
            marginBottom="l"
            onPress={() => navigation.push('AccountPassphraseGeneration')}
            title={t('generic.understand')}
          />
        </Box>
      </SafeAreaBox>
    </Box>
  )
}

export default AccountPassphraseWarningScreen
