import React, { useEffect, useState } from 'react'
import { Modal, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import Lock from '@assets/images/lock_ico.svg'
import MatchingWord from '../accountImport/MatchingWord'
import wordlist from '../../../constants/wordlists/english.json'
import TextInput from '../../../components/TextInput'
import Box from '../../../components/Box'
import SafeAreaBox from '../../../components/SafeAreaBox'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Close from '../../../assets/images/close.svg'
import BlurBox from '../../../components/BlurBox'

type Props = {
  onSelectWord: (fullWord: string, idx: number) => void
  wordIdx: number
  visible: boolean
  onRequestClose: () => void
}

export const TOTAL_WORDS = 12

const ImportReplaceWordModal = ({
  onSelectWord,
  wordIdx,
  visible,
  onRequestClose,
}: Props) => {
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
    <Modal
      presentationStyle="overFullScreen"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
    >
      <BlurBox position="absolute" top={0} bottom={0} left={0} right={0} />
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        backgroundColor="primaryBackground"
        opacity={0.8}
      />
      <SafeAreaBox flex={1}>
        <TouchableOpacityBox onPress={onRequestClose} padding="l">
          <Close color="white" height={24} width={24} />
        </TouchableOpacityBox>
        <Box
          marginTop={{ smallPhone: 'm', phone: 'xxl' }}
          paddingHorizontal="lx"
        >
          <Lock />

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
      </SafeAreaBox>
    </Modal>
  )
}

export default ImportReplaceWordModal
