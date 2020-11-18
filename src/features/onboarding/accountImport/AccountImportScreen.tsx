/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BackButton from '../../../components/BackButton'
import Box from '../../../components/Box'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import TextInput from '../../../components/TextInput'
import TextTransform from '../../../components/TextTransform'

const AccountImportScreen = () => {
  const { t } = useTranslation()
  const [word, setWord] = useState('')
  const [words, setWords] = useState(new Array<string>())
  const wordNumber = words.length + 1

  return (
    <SafeAreaBox
      flex={1}
      backgroundColor="mainBackground"
      flexDirection="column"
      paddingHorizontal="l"
    >
      <BackButton
      // onPress={navigation.goBack}
      />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
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
          marginTop="l"
          padding="m"
          variant="regular"
          placeholder={t('account_import.word_entry.placeholder', {
            ordinal: t(`ordinals.${wordNumber}`),
          })}
          // onChangeText={this.handleChangeText}
          // value={this.state.word}
          keyboardAppearance="dark"
          autoCorrect={false}
          autoCompleteType="off"
          blurOnSubmit={false}
          returnKeyType="next"
          autoFocus
        />
      </KeyboardAwareScrollView>
    </SafeAreaBox>
  )
}

export default AccountImportScreen
