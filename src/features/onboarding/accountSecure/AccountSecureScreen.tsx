import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Secure from '../../../assets/images/secure.svg'
import Button from '../../../components/Button'
import { OnboardingNavigationProp } from '../onboardingTypes'

const AccountSecureScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()
  return (
    <Box backgroundColor="mainBackground" flex={1} padding="l">
      <Box flex={1} justifyContent="center" alignItems="center">
        <Secure />
        <Text variant="header" marginTop="xxl">
          {t('account_setup.success.title')}
        </Text>
        <Text variant="body" marginTop="s" textAlign="center">
          {t('account_setup.success.subtitle_1')}
        </Text>
        <Text variant="body" marginTop="m" textAlign="center">
          {t('account_setup.success.subtitle_2')}
        </Text>
      </Box>
      <Button
        mode="contained"
        variant="primary"
        width="100%"
        marginBottom="l"
        onPress={() => navigation.push('AccountCreatePinScreen')}
        title={t('account_setup.success.next')}
      />
    </Box>
  )
}

export default AccountSecureScreen
