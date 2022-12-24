import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { Buffer } from 'buffer'
import RNSodium from 'react-native-sodium'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import BackScreen from '../../../components/BackScreen'
import TextTransform from '../../../components/TextTransform'
import { getMnemonic } from '../../../utils/secureAccount'
import Articles from '../../../constants/articles'
import TextInput from '../../../components/TextInput'

const RevealPrivateKeyScreen = () => {
  const { t } = useTranslation()
  const [password, setPassword] = useState<string>()

  const exportToWalletApp = useCallback(async () => {
    const mnemonic = await getMnemonic()
    if (!mnemonic || !mnemonic.words || !password) return

    const encoded = Buffer.from(JSON.stringify(mnemonic.words))
    const nonce = await RNSodium.randombytes_buf(
      RNSodium.crypto_secretbox_NONCEBYTES,
    )
    const salt = await RNSodium.randombytes_buf(
      RNSodium.crypto_pwhash_SALTBYTES,
    )
    const key = await RNSodium.crypto_pwhash(
      32,
      Buffer.from(password).toString('base64'),
      salt,
      RNSodium.crypto_pwhash_OPSLIMIT_MODERATE,
      RNSodium.crypto_pwhash_MEMLIMIT_MODERATE,
      RNSodium.crypto_pwhash_ALG_ARGON2ID13,
    )
    const ciphertext = await RNSodium.crypto_secretbox_easy(
      encoded.toString('base64'),
      nonce,
      key,
    )
    const data = JSON.stringify({ ciphertext, nonce, salt })
    const encodedData = Buffer.from(data).toString('base64')
    Linking.openURL(`${Articles.Wallet_Site}/import_key/${encodedData}`)
  }, [password])

  const onChangeText = useCallback((text) => {
    setPassword(text)
  }, [])

  const onDownload = useCallback(() => {
    Linking.openURL(Articles.Wallet_Site)
  }, [])

  return (
    <BackScreen backgroundColor="primaryBackground" flex={1}>
      <Text
        variant="h1"
        maxFontSizeMultiplier={1}
        numberOfLines={1}
        adjustsFontSizeToFit
        textAlign="center"
      >
        {t('account_setup.revealPrivateKey.title')}
      </Text>
      <TextTransform
        variant="body1"
        maxFontSizeMultiplier={1}
        textAlign="center"
        marginTop="l"
        i18nKey="account_setup.revealPrivateKey.subtitle"
      />
      <Text
        variant="body1"
        maxFontSizeMultiplier={1}
        marginTop="xl"
        marginBottom="m"
        textAlign="center"
      >
        {t('account_setup.revealPrivateKey.passMessage')}
      </Text>
      <TextInput
        textAlign="center"
        variant="regularDark"
        placeholder={t('account_setup.revealPrivateKey.inputPlaceholder')}
        keyboardAppearance="dark"
        autoCorrect={false}
        autoComplete="off"
        returnKeyType="done"
        autoCapitalize="none"
        onChangeText={onChangeText}
      />
      <Box flex={1} />
      <Button
        height={60}
        borderRadius="round"
        title={t('account_setup.revealPrivateKey.download')}
        mode="text"
        marginBottom="m"
        onPress={onDownload}
      />
      <Button
        height={60}
        disabled={!password}
        borderRadius="round"
        backgroundColor="purpleMain"
        title={t('account_setup.revealPrivateKey.export')}
        marginBottom="m"
        mode="contained"
        onPress={exportToWalletApp}
      />
    </BackScreen>
  )
}

export default memo(RevealPrivateKeyScreen)
