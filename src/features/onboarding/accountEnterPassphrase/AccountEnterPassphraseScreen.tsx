/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
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
  const wordArr = [
    'bacon',
    'eggs',
    'potato',
    'salt',
    'pepper',
    'paprika',
    'toast',
    'butter',
    'pancake',
    'syrup',
    'plate',
    'fork',
  ]
  const [step, setStep] = useState(0)
  const [correctWord, setCorrectWord] = useState<string | null>('chicken')
  const [chipPress, setChipPressed] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [mnemonic, setMnemonic] = useState<Array<string>>([])
  const [challengeWords, setChallengeWords] = useState<Array<string>>(wordArr)

  const { t } = useTranslation()
  const navigation = useNavigation<OnboardingNavigationProp>()

  const resetState = async () => {
    // const wordStr = await getMnemonic()
    const wordStr = wordArr.join(' ')
    setMnemonic(wordStr.split(' '))
    setStep(0)
    setCorrectWord(null)
    setFailed(false)
    setChipPressed(null)
    setChallengeWords(wordArr)
  }

  return (
    <>
      <Box
        backgroundColor="mainBackground"
        flex={1}
        alignItems="center"
        flexDirection="column-reverse"
        padding="l"
      >
        <Box>
          <Box flexDirection="row" flexWrap="wrap">
            {challengeWords.map((word, idx) => (
              <PhraseChip
                marginRight="s"
                marginBottom="s"
                key={word}
                title={word}
                onPress={() => {
                  if (idx % 2 === 0) {
                    setFailed(true)
                  } else {
                    navigation.push('AccountSecureScreen')
                  }
                }}
              />
            ))}
          </Box>
          <Button
            title={t('account_setup.confirm.forgot')}
            marginTop="m"
            onPress={navigation.goBack}
          />
        </Box>
        <Box
          flex={1}
          alignItems="center"
          justifyContent="center"
          alignContent="center"
        >
          <Box height={162} justifyContent="center" alignItems="center">
            <Text variant="header" numberOfLines={1} adjustsFontSizeToFit>
              {t('account_setup.confirm.title')}
            </Text>
            <Text variant="body">
              {t('account_setup.confirm.subtitle', {
                ordinal: t(`ordinals.${0}`),
              })}
            </Text>
            {correctWord && (
              <PhraseChip marginTop="xxl" selected title={correctWord} />
            )}
          </Box>
        </Box>
      </Box>
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
          <Text variant="body" marginTop="l">
            {t('account_setup.confirm.failed.subtitle_1')}
          </Text>
          <Text variant="body">
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
