import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { Animated, Easing } from 'react-native'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { OnboardingNavigationProp } from '../onboardingTypes'
import { createKeypair } from '../../../utils/secureAccount'

const DURATION = 4000
const IMAGE_SIZE = 212

const AccountPassphraseGenerationScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()

  const rotateAnim = useRef(new Animated.Value(0))

  const anim = () =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim.current, {
          toValue: 2,
          duration: DURATION,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
    ).start()

  useEffect(() => {
    const genKeypair = async () => {
      await createKeypair()
    }

    const timer = setTimeout(
      () => navigation.replace('AccountCreatePassphraseScreen'),
      DURATION,
    )

    genKeypair()
    anim()
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
      <Box>
        <Animated.Image
          source={require('../../../assets/images/generateLoader.png')}
          style={{
            position: 'absolute',
            height: IMAGE_SIZE,
            width: IMAGE_SIZE,
            transform: [
              {
                rotate: rotateAnim.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          }}
        />
        <Animated.Image
          source={require('../../../assets/images/generateLoaderInner.png')}
          style={{
            height: IMAGE_SIZE,
            width: IMAGE_SIZE,
            transform: [
              {
                rotate: rotateAnim.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        />
      </Box>
      <Text textAlign="center" variant="body2Light" marginTop="xl">
        {t('account_setup.generating')}
      </Text>
    </SafeAreaBox>
  )
}

export default AccountPassphraseGenerationScreen
