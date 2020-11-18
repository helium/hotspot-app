import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BackButton from '../../../components/BackButton'
import Box from '../../../components/Box'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import TextInput from '../../../components/TextInput'
import TextTransform from '../../../components/TextTransform'
import { OnboardingNavigationProp } from '../onboardingTypes'
import PassphraseAutocomplete from './PassphraseAutocomplete'

const AccountImportScreen = () => {
  const { t } = useTranslation()
  const [word, setWord] = useState('')
  const [words, setWords] = useState(new Array<string>())
  const [complete, setComplete] = useState(false)

  const wordNumber = words.length
  const navigation = useNavigation<OnboardingNavigationProp>()

  const resetState = () => {
    setWord('')
    setWords([])
    setComplete(false)
  }

  useEffect(() => {
    resetState()
    const unsubscribe = navigation.addListener('blur', () => {
      resetState()
    })

    return unsubscribe
  }, [navigation])

  const handleSelectWord = (selectedWord: string) => {
    setWord('')

    setWords((prevWords) => [...prevWords, selectedWord])
  }

  useEffect(() => {
    if (words.length === 12) {
      setComplete(true)
    }
  }, [words])

  useEffect(() => {
    if (complete) {
      navigation.push('ImportAccountConfirmScreen', { words })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, navigation])

  return (
    <SafeAreaBox
      flex={1}
      backgroundColor="mainBackground"
      flexDirection="column"
      paddingHorizontal="l"
    >
      <BackButton onPress={navigation.goBack} />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        {!complete && (
          <>
            <Box marginHorizontal="xl" marginTop="m">
              <Text
                variant="header"
                numberOfLines={1}
                adjustsFontSizeToFit
                textAlign="center"
                marginBottom="s"
              >
                {t('account_import.word_entry.title')}
              </Text>
              <TextTransform
                textAlign="center"
                variant="body"
                color="green"
                marginBottom="s"
                i18nKey={t('account_import.word_entry.directions', {
                  ordinal: t(`ordinals.${wordNumber}`),
                })}
              />
              <Text variant="body" textAlign="center" color="lightGray">
                {t('account_import.word_entry.subtitle')}
              </Text>
            </Box>
            <TextInput
              marginVertical="l"
              padding="m"
              variant="regular"
              placeholder={t('account_import.word_entry.placeholder', {
                ordinal: t(`ordinals.${wordNumber}`),
              })}
              onChangeText={setWord}
              value={word}
              keyboardAppearance="dark"
              autoCorrect={false}
              autoCompleteType="off"
              blurOnSubmit={false}
              returnKeyType="next"
              autoFocus
            />

            <PassphraseAutocomplete
              onSelectWord={handleSelectWord}
              matchText={word}
            />
          </>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaBox>
  )
}

export default AccountImportScreen
