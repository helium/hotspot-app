import React, { useEffect, useRef } from 'react'
import { Alert } from 'react-native'
import LottieView from 'lottie-react-native'
import { useTranslation } from 'react-i18next'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import SafeAreaBox from '../../../components/SafeAreaBox'
import {
  OnboardingNavigationProp,
  OnboardingStackParamList,
} from '../onboardingTypes'
import { createKeypair } from '../../../utils/secureAccount'

type Route = RouteProp<OnboardingStackParamList, 'AccountImportCompleteScreen'>

const AccountImportCompleteScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()
  const lottieRef = useRef<LottieView>(null)

  const {
    params: { words },
  } = useRoute<Route>()

  useEffect(() => {
    let timer: NodeJS.Timeout

    const genKeypair = async () => {
      try {
        await createKeypair(words)
        timer = setTimeout(() => {
          navigation.push('AccountCreatePinScreen', { fromImport: true })
        }, 2000)
      } catch (error) {
        timer = setTimeout(() => {
          lottieRef.current?.pause()
          lottieRef.current?.reset()
          Alert.alert(
            t('account_import.alert.title'),
            t('account_import.alert.body'),
            [{ text: t('generic.ok'), onPress: () => navigation.goBack() }],
            { cancelable: false },
          )
        }, 1000)
      }
    }

    genKeypair()

    return () => {
      clearTimeout(timer)
    }
  }, [words, navigation, t])

  return (
    <SafeAreaBox
      flex={1}
      backgroundColor="primaryBackground"
      justifyContent="flex-start"
      padding="xl"
      paddingTop="xxl"
    >
      <Box width="100%" height={240} marginBottom="n_xl">
        <LottieView
          source={require('../../../assets/animations/importAccountLoader.json')}
          autoPlay
          ref={lottieRef}
        />
      </Box>
      <Text variant="header" color="white" marginBottom="m" textAlign="center">
        {t('account_import.complete.title')}
      </Text>
      <Text variant="body2Light" color="white" textAlign="center">
        {t('account_import.complete.subtitle')}
      </Text>
    </SafeAreaBox>
  )
}

export default AccountImportCompleteScreen
