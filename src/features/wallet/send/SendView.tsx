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

// burn
// {"type":"dc_burn","address":"112qB3YaH5bZkCnKA5uRH7tBtGNv2Y5B4smv1jsmvGUzgKT71QpE","amount":"0.72474797","memo":"qX3/BGt6yQE="}

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
            {(123455.12345678).toLocaleString()} HNT Available
          </Text>
        </Box>
        <Box flex={3} backgroundColor="white" padding="l">
          <Box height="100%" justifyContent="space-between">
            <Box>
              <SendInput
                type="address"
                defaultValue={address}
                onChange={handleAddressChange}
                label="Recipient Address"
                placeholder="Enter Address..."
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
                label="Amount (HNT)"
                placeholder="0"
                extra={
                  <TouchableOpacityBox onPress={() => triggerNavHaptic()}>
                    <Text fontSize={12} color="primaryMain">
                      Send Max
                    </Text>
                  </TouchableOpacityBox>
                }
              />
            </Box>
            <Button
              title="Send HNT"
              variant="primary"
              backgroundColor="primaryMain"
            />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Box>
  )
}

export default SendView
