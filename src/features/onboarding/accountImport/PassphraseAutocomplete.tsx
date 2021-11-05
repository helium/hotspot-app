import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import Lock from '@assets/images/lock_ico.svg'
import MatchingWord from './MatchingWord'
import wordlist from '../../../constants/wordlists/english.json'
import TextInput from '../../../components/TextInput'
import Text from '../../../components/Text'
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
  const ordinal = wordIdx < TOTAL_WORDS ? t(`ordinals.${wordIdx}`) : ''

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
    <KeyboardAvoidingView
      keyboardVerticalOffset={40}
      behavior="position"
      style={styles.container}
    >
      <Box marginTop={{ smallPhone: 'm', phone: 'xxl' }}>
        <Lock />
        <Text
          marginTop="l"
          variant="bold"
          fontSize={27}
          numberOfLines={2}
          maxFontSizeMultiplier={1}
          adjustsFontSizeToFit
          marginBottom="s"
        >
          {t('account_import.word_entry.title')}
        </Text>
        <Text variant="light" color="grayLight" fontSize={20}>
          {t('account_import.word_entry.subtitle')}
        </Text>

        <TextInput
          variant="regularDark"
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
          marginTop="l"
          marginBottom="s"
          autoFocus
        />
        <ScrollView
          horizontal
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          style={{ height: 40 }}
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

const styles = StyleSheet.create({
  container: { width: '100%', flex: 1 },
})

export default PassphraseAutocomplete
