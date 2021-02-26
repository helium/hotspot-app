import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import TextTransform from '../../../components/TextTransform'
import Button from '../../../components/Button'
import { OnboardingNavigationProp } from '../onboardingTypes'
import BackScreen from '../../../components/BackScreen'
import LockIcon from '../../../assets/images/lockIcon.svg'

const AccountPassphraseWarningScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()
  return (
    <BackScreen
      flex={1}
      flexDirection="column"
      paddingHorizontal="lx"
      paddingBottom="none"
    >
      <Box flex={1} justifyContent="center" marginBottom="xxl">
        <LockIcon />
        <Text
          marginVertical="lx"
          variant="h1"
          numberOfLines={2}
          maxFontSizeMultiplier={1}
          adjustsFontSizeToFit
        >
          {t('account_setup.warning.title')}
        </Text>
        <TextTransform
          maxFontSizeMultiplier={1}
          numberOfLines={4}
          adjustsFontSizeToFit
          variant="subtitle"
          i18nKey="account_setup.warning.subtitle"
        />
      </Box>
      <Button
        mode="contained"
        variant="primary"
        width="100%"
        marginBottom="l"
        onPress={() => navigation.push('AccountPassphraseGeneration')}
        title={t('account_setup.warning.generate')}
      />
    </BackScreen>
  )
}

export default AccountPassphraseWarningScreen
