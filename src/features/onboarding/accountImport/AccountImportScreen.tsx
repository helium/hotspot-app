import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BackButton from '../../../components/BackButton'
import SafeAreaBox from '../../../components/SafeAreaBox'
import { OnboardingNavigationProp } from '../onboardingTypes'
import PassphraseAutocomplete from './PassphraseAutocomplete'

const AccountImportScreen = () => {
  const [words, setWords] = useState(new Array<string>())
  const [complete, setComplete] = useState(false)

  const navigation = useNavigation<OnboardingNavigationProp>()

  const resetState = () => {
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

  const handleSelectWord = (selectedWord: string) =>
    setWords((prevWords) => [...prevWords, selectedWord])

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
          <PassphraseAutocomplete
            onSelectWord={handleSelectWord}
            wordIdx={words.length}
          />
        )}
      </KeyboardAwareScrollView>
    </SafeAreaBox>
  )
}

export default AccountImportScreen
