import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { OnboardingNavigationProp } from '../onboardingTypes'
import { createKeypair } from '../../../utils/secureAccount'
import RingLoader from '../../../components/Loaders/RingLoader'

const DURATION = 4000
const IMAGE_SIZE = 212

const AccountPassphraseGenerationScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()

  useEffect(() => {
    const genKeypair = async () => {
      await createKeypair()
    }

    const timer = setTimeout(
      () => navigation.replace('AccountCreatePassphraseScreen'),
      DURATION,
    )

    genKeypair()
    return () => {
      clearTimeout(timer)
    }
  }, [navigation])

  return (
    <SafeAreaBox
      flex={1}
      paddingVertical={{ phone: 'xxl', smallPhone: 'l' }}
      paddingHorizontal="l"
      backgroundColor="primaryBackground"
      alignItems="center"
      justifyContent="center"
    >
      <RingLoader color="purple" size={IMAGE_SIZE} />
      <Text textAlign="center" variant="body2Light" marginTop="xl">
        {t('account_setup.generating')}
      </Text>
    </SafeAreaBox>
  )
}

export default AccountPassphraseGenerationScreen
