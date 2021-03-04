import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from 'react-native'
import Box from '../../../components/Box'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import WordList from '../../../components/WordList'
import {
  OnboardingNavigationProp,
  OnboardingStackParamList,
} from '../onboardingTypes'
import PassphraseAutocomplete from '../accountImport/PassphraseAutocomplete'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Button from '../../../components/Button'
import Close from '../../../assets/images/close.svg'
import BackScreen from '../../../components/BackScreen'

type Route = RouteProp<OnboardingStackParamList, 'ImportAccountConfirmScreen'>
const ImportAccountConfirmScreen = () => {
  const { t } = useTranslation()
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null)
  const [words, setWords] = useState<Array<string>>([])
  const navigation = useNavigation<OnboardingNavigationProp>()
  const {
    params: { words: routeWords },
  } = useRoute<Route>()

  useEffect(() => {
    setWords(routeWords)
  }, [routeWords])

  const clearSelection = () => setSelectedWordIdx(null)

  const handleWordEdit = (idx: number) => () => setSelectedWordIdx(idx)

  const replaceWord = (newWord: string, idx: number) => {
    clearSelection()

    setWords((prevWords) => {
      const nextWords = [...prevWords]
      nextWords[idx] = newWord
      return nextWords
    })
  }

  return (
    <BackScreen>
      <Box paddingHorizontal="l">
        <Text
          variant="h1"
          numberOfLines={2}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1}
        >
          {t('account_import.confirm.title')}
        </Text>
        <Text
          variant="body2Light"
          marginTop="s"
          marginBottom={{ smallPhone: 's', phone: 'xl' }}
          maxFontSizeMultiplier={1.2}
        >
          {t('account_import.confirm.subtitle')}
        </Text>
      </Box>
      <WordList words={words} onPressWord={handleWordEdit} />
      <Box
        paddingHorizontal="l"
        paddingBottom="l"
        flex={3}
        justifyContent="flex-end"
      >
        <Button
          onPress={() =>
            navigation.push('AccountImportCompleteScreen', { words })
          }
          variant="primary"
          mode="contained"
          title={t('account_import.confirm.next')}
        />
      </Box>

      <Modal
        presentationStyle="overFullScreen"
        transparent
        visible={selectedWordIdx !== null}
        onRequestClose={clearSelection}
        animationType="fade"
      >
        <SafeAreaBox
          backgroundColor="primaryBackground"
          opacity={0.98}
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal="l"
          paddingTop="l"
        >
          <TouchableOpacityBox alignSelf="flex-start" onPress={clearSelection}>
            <Close color="white" height={24} width={24} />
          </TouchableOpacityBox>
          <PassphraseAutocomplete
            onSelectWord={replaceWord}
            wordIdx={selectedWordIdx ?? 0}
          />
        </SafeAreaBox>
      </Modal>
    </BackScreen>
  )
}

export default ImportAccountConfirmScreen
