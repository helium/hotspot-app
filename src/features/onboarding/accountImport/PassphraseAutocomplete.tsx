import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import MatchingWord from './MatchingWord'
import wordlist from '../../../constants/wordlists/english.json'
import TextInput from '../../../components/TextInput'
import Text from '../../../components/Text'
import TextTransform from '../../../components/TextTransform'
import Box from '../../../components/Box'

type Props = {
  onSelectWord: (fullWord: string, idx: number) => void
  wordIdx: number
}

export const TOTAL_WORDS = 12

const PassphraseAutocomplete = ({ onSelectWord, wordIdx }: Props) => {
  const [word, setWord] = useState('')
  const [matchingWords, setMatchingWords] = useState<Array<string>>([])
  const { t } = useTranslation()
  const ordinal = wordIdx <= TOTAL_WORDS ? t(`ordinals.${wordIdx}`) : ''

  useEffect(() => {
    setMatchingWords(
      wordlist.filter((w) => w.indexOf(word.toLowerCase()) === 0),
    )
  }, [word])

  const handleWordSelect = (selectedWord: string) => {
    setWord('')
    onSelectWord(selectedWord, wordIdx)
  }

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={38} behavior="position">
      <Box marginTop="m">
        <Text
          variant="h1"
          numberOfLines={2}
          maxFontSizeMultiplier={1}
          adjustsFontSizeToFit
          marginBottom="m"
        >
          {t('account_import.word_entry.title')}
        </Text>
        <Text variant="body1Light" color="grayLight">
          {t('account_import.word_entry.subtitle')}
        </Text>
        <TextTransform
          marginTop="lx"
          variant="body2Light"
          color="greenMain"
          values={{ ordinal }}
          i18nKey="account_import.word_entry.directions"
        />

        <TextInput
          padding="m"
          variant="regular"
          placeholder={t('account_import.word_entry.placeholder', {
            ordinal,
          })}
          onChangeText={setWord}
          value={word}
          keyboardAppearance="dark"
          autoCorrect={false}
          autoCompleteType="off"
          blurOnSubmit={false}
          returnKeyType="next"
          marginVertical="ms"
          autoFocus
        />
        <ScrollView
          horizontal
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          showsHorizontalScrollIndicator={false}
        >
          {matchingWords.length <= 20 &&
            matchingWords.map((matchingWord, idx) => (
              <MatchingWord
                // eslint-disable-next-line react/no-array-index-key
                key={`${matchingWord}.${idx}`}
                fullWord={matchingWord}
                matchingText={word.toLowerCase()}
                onPress={handleWordSelect}
              />
            ))}
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  )
}

export default PassphraseAutocomplete
