import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAsync } from 'react-async-hook'
import { useNavigation } from '@react-navigation/native'
import bs58 from 'bs58'
import Text from '../../../components/Text'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import BackScreen from '../../../components/BackScreen'
import TextTransform from '../../../components/TextTransform'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CopyAddress from '../../../components/CopyAddress'
import useAlert from '../../../utils/useAlert'
import { getKeypair } from '../../../utils/secureAccount'

const RevealPrivateKeyScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [privateKey, setPrivateKey] = useState<string>()
  const [revealed, setRevealed] = useState(false)
  const { showOKCancelAlert } = useAlert()

  useAsync(async () => {
    // don't remove key from secure store until they press reveal
    if (!revealed) return
    const keypair = await getKeypair()
    if (!keypair || !keypair.privateKey) return
    setPrivateKey(bs58.encode(keypair.privateKey))
  }, [revealed])

  const showConfirmDialog = useCallback(async () => {
    const decision = await showOKCancelAlert({
      titleKey: 'account_setup.revealPrivateKey.alertTitle',
      messageKey: 'account_setup.revealPrivateKey.alertMessage',
    })
    setRevealed(decision)
  }, [showOKCancelAlert])

  return (
    <BackScreen backgroundColor="primaryBackground" flex={1}>
      <Text variant="h1" maxFontSizeMultiplier={1} marginTop="xl">
        {t('account_setup.revealPrivateKey.title')}
      </Text>
      <TextTransform
        variant="body1"
        maxFontSizeMultiplier={1}
        marginTop="m"
        i18nKey="account_setup.revealPrivateKey.subtitle"
        marginBottom="xl"
      />
      {revealed ? (
        <>
          <Box
            marginHorizontal="xs"
            height={{ smallPhone: 80, phone: 100 }}
            marginVertical="l"
            backgroundColor="primaryBackground"
            padding="l"
            borderRadius="m"
            justifyContent="center"
          >
            <Text
              fontSize={12}
              color="primaryText"
              maxFontSizeMultiplier={1}
              selectable
            >
              {privateKey}
            </Text>
          </Box>
          <CopyAddress address={privateKey || ''} />
        </>
      ) : (
        <TouchableOpacityBox
          onPress={showConfirmDialog}
          marginHorizontal="xs"
          height={{ smallPhone: 80, phone: 100 }}
          marginVertical="l"
          backgroundColor="purple500"
          padding="l"
          borderRadius="m"
          justifyContent="center"
        >
          <Text
            fontSize={18}
            color="primaryText"
            maxFontSizeMultiplier={1}
            textAlign="center"
            fontWeight="bold"
            selectable
          >
            {t('account_setup.revealPrivateKey.tap')}
          </Text>
        </TouchableOpacityBox>
      )}
      <Box flex={1} />
      <Button
        height={60}
        borderRadius="round"
        backgroundColor="purpleMain"
        title={t('account_setup.revealPrivateKey.done')}
        marginBottom="m"
        mode="contained"
        onPress={navigation.goBack}
      />
    </BackScreen>
  )
}

export default memo(RevealPrivateKeyScreen)
