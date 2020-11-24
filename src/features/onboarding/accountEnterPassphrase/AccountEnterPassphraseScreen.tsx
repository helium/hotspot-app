import React, { useState, useEffect, useCallback } from 'react'
import { random, shuffle, uniq, take, reject, sampleSize } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { Modal } from 'react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import wordlist from '../../../constants/wordlists/english.json'
import PhraseChip from './PhraseChip'
import Button from '../../../components/Button'
import { OnboardingNavigationProp } from '../onboardingTypes'
import { getMnemonic } from '../../../utils/account'
import SafeAreaBox from '../../../components/SafeAreaBox'

const testIndices = __DEV__
  ? [0, 1, 2]
  : [random(0, 3), random(4, 7), random(8, 11)]

const generateChallengeWords = (targetWord: string) =>
  shuffle(
    uniq(
      take(reject(sampleSize(wordlist, 12), targetWord), 11).concat(targetWord),
    ),
  )

const AccountEnterPassphraseScreen = () => {
  const [step, setStep] = useState(0)
  const [correctWord, setCorrectWord] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [mnemonic, setMnemonic] = useState<Array<string>>([])
  const [challengeWords, setChallengeWords] = useState<Array<string>>([])

  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()

  const findTargetWord = useCallback(
    (pos: number, nextMnemonic?: string[] | undefined) => {
      return (nextMnemonic || mnemonic)[testIndices[pos]]
    },
    [mnemonic],
  )

  const onPressWord = (word: string) => {
    if (word === findTargetWord(step)) {
      setCorrectWord(word)
      nextStep()
    } else {
      setFailed(true)
      setChallengeWords(generateChallengeWords(findTargetWord(step)))
    }
  }

  const nextStep = () => {
    setTimeout(() => {
      if (step === 2) {
        navigation.push('AccountSecureScreen')
      } else {
        setStep(step + 1)
        setCorrectWord(null)
        setChallengeWords(generateChallengeWords(findTargetWord(step + 1)))
      }
    }, 1000)
  }

  const resetState = useCallback(async () => {
    const wordStr = await getMnemonic()
    const nextMnemonic = wordStr?.words || []
    setMnemonic(nextMnemonic)
    setStep(0)
    setCorrectWord(null)
    setFailed(false)
    setChallengeWords(
      generateChallengeWords(findTargetWord(step, nextMnemonic)),
    )
  }, [step, findTargetWord])

  useEffect(() => {
    resetState()
    const unsubscribe = navigation.addListener('blur', () => {
      resetState()
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation])

  return (
    <>
      <SafeAreaBox
        backgroundColor="mainBackground"
        flex={1}
        alignItems="center"
        padding="l"
      >
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text variant="header" numberOfLines={1} adjustsFontSizeToFit>
            {t('account_setup.confirm.title')}
          </Text>
          <Text variant="bodyLight">
            {t('account_setup.confirm.subtitle', {
              ordinal: t(`ordinals.${testIndices[step]}`),
            })}
          </Text>
          <Box height={100}>
            {correctWord && (
              <PhraseChip marginTop="xl" selected title={correctWord} />
            )}
          </Box>
        </Box>
        <Box flex={1} flexDirection="row" flexWrap="wrap">
          {challengeWords.map((word) => (
            <PhraseChip
              marginRight="s"
              marginBottom="s"
              key={word}
              title={word}
              onPress={() => !correctWord && onPressWord(word)}
            />
          ))}
        </Box>
        <Button
          title={t('account_setup.confirm.forgot')}
          marginTop="m"
          onPress={navigation.goBack}
        />
        <Box />
      </SafeAreaBox>
      <Modal
        presentationStyle="overFullScreen"
        transparent
        visible={failed}
        onRequestClose={resetState}
        animationType="fade"
      >
        <Box
          backgroundColor="mainBackground"
          opacity={0.95}
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal="l"
        >
          <Text variant="header">
            {t('account_setup.confirm.failed.title')}
          </Text>
          <Text variant="bodyLight" marginTop="l">
            {t('account_setup.confirm.failed.subtitle_1')}
          </Text>
          <Text variant="bodyLight">
            {t('account_setup.confirm.failed.subtitle_2')}
          </Text>
          <Button
            marginTop="l"
            mode="contained"
            width="100%"
            onPress={resetState}
            variant="secondary"
            title={t('account_setup.confirm.failed.try_again')}
          />
        </Box>
      </Modal>
    </>
  )
}

export default AccountEnterPassphraseScreen
