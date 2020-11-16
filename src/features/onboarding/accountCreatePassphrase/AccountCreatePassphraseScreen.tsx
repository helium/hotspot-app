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
import Word from './Word'
import TextTransform from '../../../components/TextTransform'
import Button from '../../../components/Button'
import { getMnemonic } from '../../../utils/account'

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
    <Box flex={1} backgroundColor="mainBackground">
      <Box position="absolute" right={0}>
        <Lock />
      </Box>

      <SafeAreaBox>
        <BackButton paddingHorizontal="l" onPress={navigation.goBack} />
      </SafeAreaBox>

      <Box flex={1} flexDirection="column" justifyContent="space-around">
        <Box paddingHorizontal="lx">
          <Text variant="header">{t('account_setup.passphrase.title1')}</Text>
          <Text variant="header">{t('account_setup.passphrase.title2')}</Text>
        </Box>
        <Box
          backgroundColor="secondaryBackground"
          flexDirection="row"
          minHeight={180}
          alignContent="space-between"
          paddingVertical="m"
        >
          <Box flex={1} paddingHorizontal="lx">
            {words.slice(0, 6).map((word, idx) => (
              <Word
                key={word}
                position={idx + 1}
                word={word}
                opacity={opacity.current}
              />
            ))}
          </Box>
          <Box flex={1} paddingHorizontal="lx">
            {words.slice(6).map((word, idx) => (
              <Word
                key={word}
                position={idx + 7}
                word={word}
                opacity={opacity.current}
              />
            ))}
          </Box>
        </Box>
        <Box paddingHorizontal="l">
          <TextTransform
            marginBottom="m"
            variant="body"
            i18nKey="account_setup.passphrase.warning_1"
          />
          <TextTransform
            variant="body"
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
