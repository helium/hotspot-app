import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { Animated } from 'react-native'
import Lock from '../../../assets/images/lock.svg'
import BackButton from '../../../components/BackButton'
import Box from '../../../components/Box'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { OnboardingNavigationProp } from '../onboardingTypes'
import TextTransform from '../../../components/TextTransform'
import Button from '../../../components/Button'
import { getMnemonic } from '../../../utils/secureAccount'
import WordList from '../../../components/WordList'

const AccountCreatePassphraseScreen = () => {
  const { t } = useTranslation()
  const [words, setWords] = useState<Array<string>>([])
  const opacity = useRef(new Animated.Value(0))

  useEffect(() => {
    const getWords = async () => {
      const mnemonic = await getMnemonic()
      setWords(mnemonic?.words || [])
    }
    getWords()
  }, [])

  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words])

  const navigation = useNavigation<OnboardingNavigationProp>()

  return (
    <Box flex={1} backgroundColor="primaryBackground">
      <Box position="absolute" right={0}>
        <Lock />
      </Box>

      <SafeAreaBox>
        <BackButton paddingHorizontal="l" onPress={navigation.goBack} />
      </SafeAreaBox>

      <Box flex={1} flexDirection="column" justifyContent="space-around">
        <Box paddingHorizontal="lx">
          <Text variant="h1">{t('account_setup.passphrase.title1')}</Text>
          <Text variant="h1">{t('account_setup.passphrase.title2')}</Text>
        </Box>
        <WordList words={words} />
        <Box paddingHorizontal="l">
          <TextTransform
            marginBottom="m"
            variant="body2Light"
            i18nKey="account_setup.passphrase.warning_1"
          />
          <TextTransform
            variant="body2Light"
            i18nKey="account_setup.passphrase.warning_2"
          />
        </Box>
        <Button
          marginHorizontal="l"
          mode="contained"
          variant="primary"
          onPress={() => navigation.push('AccountEnterPassphraseScreen')}
          title={t('account_setup.passphrase.next')}
        />
      </Box>
    </Box>
  )
}

export default AccountCreatePassphraseScreen
