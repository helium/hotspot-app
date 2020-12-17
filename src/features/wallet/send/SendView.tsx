import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import SendInput from './SendInput'
import Button from '../../../components/Button'
import SendCircle from '../../../assets/images/send-circle.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { triggerNotification } from '../../../utils/haptic'
import QrCode from '../../../assets/images/qr.svg'
import Close from '../../../assets/images/close.svg'
import { useColors } from '../../../theme/themeHooks'

const SendView = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const navBack = () => {
    navigation.goBack()
    triggerNotification()
  }

  const { primaryMain } = useColors()

  return (
    <Box flex={1}>
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
        <Text variant="header">{t('send.title')}</Text>
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
              label="Recipient Address"
              placeholder="Enter Address..."
              extra={
                <TouchableOpacityBox
                  onPress={() => triggerNotification()}
                  paddingVertical="xs"
                  paddingHorizontal="s"
                >
                  <QrCode width={16} color={primaryMain} />
                </TouchableOpacityBox>
              }
            />
            <SendInput
              label="Amount (HNT)"
              extra={
                <TouchableOpacityBox onPress={() => triggerNotification()}>
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
    </Box>
  )
}

export default SendView
