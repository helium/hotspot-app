import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { Address } from '@helium/crypto-react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import SendInput from './SendInput'
import Button from '../../../components/Button'
import SendCircle from '../../../assets/images/send-circle.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { triggerNavHaptic } from '../../../utils/haptic'
import QrCode from '../../../assets/images/qr.svg'
import Close from '../../../assets/images/close.svg'
import Check from '../../../assets/images/check.svg'
import { useColors } from '../../../theme/themeHooks'
import { QrScanResult } from '../scan/scanTypes'

const SendView = ({ scanResult }: { scanResult?: QrScanResult }) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { primaryMain } = useColors()

  const [address, setAddress] = useState<string>(scanResult?.address || '')
  const [amount, setAmount] = useState<string>('')
  const [isValidAddress, setIsValidAddress] = useState<boolean>(false)
  // const [isLocked, setIsLocked] = useState<boolean>(scanResult)

  useEffect(() => {
    handleAddressChange(scanResult?.address || '')
  }, [scanResult])

  const handleAddressChange = (text: string) => {
    setAddress(text)
    setIsValidAddress(Address.isValid(text))
  }

  const handleAmountChange = (text: string) => {
    setAmount(text)
  }

  const navBack = () => {
    navigation.goBack()
    triggerNavHaptic()
  }

  const navScan = () => {
    navigation.navigate('SendScan', { fromSend: true })
    triggerNavHaptic()
  }

  const submitTxn = () => {
    // eslint-disable-next-line no-console
    console.log('address', address)
    // eslint-disable-next-line no-console
    console.log('amount', amount)
  }

  return (
    <Box flex={1}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <Box
          flex={1.3}
          backgroundColor="primaryBackground"
          justifyContent="flex-start"
          alignItems="center"
          padding="l"
        >
          <Box flexDirection="row" justifyContent="flex-end" width="100%">
            <TouchableOpacityBox padding="m" onPress={navBack}>
              <Close color="white" width={22} height={22} />
            </TouchableOpacityBox>
          </Box>
          <Box marginBottom="m">
            <SendCircle />
          </Box>
          <Text variant="h1">{t('send.title')}</Text>
        </Box>
        <Box backgroundColor="purple200" padding="m">
          <Text variant="mono" color="blueGrayLight" textAlign="center">
            {t('send.available', {
              amount: (123455.12345678).toLocaleString(),
            })}
          </Text>
        </Box>
        <Box flex={3} backgroundColor="white" padding="l">
          <Box height="100%" justifyContent="space-between">
            <Box>
              <SendInput
                type="address"
                defaultValue={address}
                onChange={handleAddressChange}
                label={t('send.address.label')}
                placeholder={t('send.address.placeholder')}
                extra={
                  isValidAddress ? (
                    <Box padding="s" position="absolute" right={0}>
                      <Check />
                    </Box>
                  ) : (
                    <TouchableOpacityBox
                      onPress={navScan}
                      padding="s"
                      position="absolute"
                      right={0}
                    >
                      <QrCode width={16} color={primaryMain} />
                    </TouchableOpacityBox>
                  )
                }
              />
              <SendInput
                type="amount"
                onChange={handleAmountChange}
                label={t('send.amount.label')}
                placeholder={t('send.amount.placeholder')}
                extra={
                  <TouchableOpacityBox onPress={() => triggerNavHaptic()}>
                    <Text fontSize={12} color="primaryMain">
                      {t('send.sendMax')}
                    </Text>
                  </TouchableOpacityBox>
                }
              />
            </Box>
            <Button
              onPress={submitTxn}
              title={t('send.button')}
              variant="primary"
              mode="contained"
              disabled={false}
            />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Box>
  )
}

export default SendView
