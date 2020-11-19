import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
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
    <Box marginTop="m">
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
          ordinal,
        })}
      />
      <Text variant="body" textAlign="center" color="lightGray">
        {t('account_import.word_entry.subtitle')}
      </Text>
      <TextInput
        marginVertical="lx"
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
        autoFocus
      />
      <ScrollView
        horizontal
        contentContainerStyle={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
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
  )
}

export default PassphraseAutocomplete
