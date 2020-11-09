import React from 'react'
import LottieView from 'lottie-react-native'
import { useTranslation } from 'react-i18next'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

const AccountPassphraseGenerationScreen = () => {
  const { t } = useTranslation()
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
