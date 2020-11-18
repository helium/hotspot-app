import React from 'react'
import { ScrollView } from 'react-native'
import MatchingWord from './MatchingWord'
import wordlist from '../../../constants/wordlists/english.json'

type Props = { matchText: string; onSelectWord: (fullWord: string) => void }

const PassphraseAutocomplete = ({ matchText, onSelectWord }: Props) => {
  const lcMatchText = matchText.toLowerCase()
  const matchingWords = wordlist.filter((w) => w.indexOf(lcMatchText) === 0)

  return (
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
        matchingWords.map((matchingWord) => (
          <MatchingWord
            key={matchingWord}
            fullWord={matchingWord}
            matchingText={lcMatchText}
            onPress={onSelectWord}
          />
        ))}
    </ScrollView>
  )
}

export default PassphraseAutocomplete
