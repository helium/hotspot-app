import React, { useEffect } from 'react'
import LottieView from 'lottie-react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { OnboardingNavigationProp } from '../onboardingTypes'
import { createKeypair } from '../../../utils/Account'

const AccountPassphraseGenerationScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()

  useEffect(() => {
    const genKeypair = async () => {
      await createKeypair()
    }

    genKeypair()
  }, [])

  useEffect(() => {
    const timer = setTimeout(
      () => navigation.replace('AccountCreatePassphraseScreen'),
      3000,
    )

    return () => {
      clearTimeout(timer)
    }
  }, [navigation])

  return (
    <SafeAreaBox
      height="100%"
      width="100%"
      paddingVertical={{ phone: 'xxl', smallPhone: 'l' }}
      paddingHorizontal="l"
      backgroundColor="mainBackground"
      alignItems="center"
    >
      <Box width="100%" aspectRatio={1}>
        <LottieView
          source={require('../../../assets/animations/accountGenerationAnimation.json')}
          autoPlay
          loop
        />
      </Box>
      <Box width={180} alignItems="center" justifyContent="flex-end" flex={1}>
        <Text textAlign="center" variant="body">
          {t('account_setup.generating')}
        </Text>
      </Box>
    </SafeAreaBox>
  )
}

export default AccountPassphraseGenerationScreen
