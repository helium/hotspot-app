import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { Linking } from 'react-native'
import { Buffer } from 'buffer'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import BackScreen from '../../../components/BackScreen'
import TextTransform from '../../../components/TextTransform'
import { getMnemonic } from '../../../utils/secureAccount'
import Articles from '../../../constants/articles'

const RevealPrivateKeyScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const exportToWalletApp = useCallback(async () => {
    const mnemonic = await getMnemonic()
    if (!mnemonic || !mnemonic.words) return
    const encoded = Buffer.from(JSON.stringify(mnemonic.words))
    Linking.openURL(
      `${Articles.Wallet_Site}/import_key/${encoded.toString('base64')}`,
    )
  }, [])

  return (
    <BackScreen backgroundColor="primaryBackground" flex={1}>
      <Text
        variant="h1"
        maxFontSizeMultiplier={1}
        marginTop="l"
        textAlign="center"
      >
        {t('account_setup.revealPrivateKey.title')}
      </Text>
      <TextTransform
        variant="body1"
        maxFontSizeMultiplier={1}
        textAlign="center"
        marginTop="xl"
        i18nKey="account_setup.revealPrivateKey.subtitle"
        marginBottom="xl"
      />
      <Box flex={1} />
      <Button
        height={60}
        borderRadius="round"
        backgroundColor="purpleMain"
        title={t('account_setup.revealPrivateKey.export')}
        marginBottom="m"
        mode="contained"
        onPress={exportToWalletApp}
      />
      <Button
        height={60}
        borderRadius="round"
        title={t('account_setup.revealPrivateKey.done')}
        mode="text"
        onPress={navigation.goBack}
      />
    </BackScreen>
  )
}

export default memo(RevealPrivateKeyScreen)
