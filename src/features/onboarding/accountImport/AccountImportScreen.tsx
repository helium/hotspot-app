import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BackButton from '../../../components/BackButton'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { OnboardingNavigationProp } from '../onboardingTypes'
import PassphraseAutocomplete, { TOTAL_WORDS } from './PassphraseAutocomplete'

const AccountImportScreen = () => {
  const [words, setWords] = useState(new Array<string>())

  const navigation = useNavigation<OnboardingNavigationProp>()

  const resetState = () => {
    setWords([])
  }

  useEffect(() => {
    resetState()
    const unsubscribe = navigation.addListener('blur', () => {
      resetState()
    })

    return unsubscribe
  }, [navigation])

  const handleSelectWord = (selectedWord: string) => {
    setWords((prevWords) => {
      const nextWords = [...prevWords, selectedWord]
      if (nextWords.length === TOTAL_WORDS) {
        navigation.push('ImportAccountConfirmScreen', { words: nextWords })
      }
      return nextWords
    })
  }

  return (
    <SafeAreaBox
      flex={1}
      backgroundColor="primaryBackground"
      flexDirection="column"
      paddingHorizontal="l"
    >
      <BackButton onPress={navigation.goBack} />
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={40}
        keyboardShouldPersistTaps="always"
      >
        <PassphraseAutocomplete
          onSelectWord={handleSelectWord}
          wordIdx={words.length}
        />
      </KeyboardAwareScrollView>
    </SafeAreaBox>
  )
}

export default AccountImportScreen
