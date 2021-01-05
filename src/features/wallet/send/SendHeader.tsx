import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import SendCircle from '../../../assets/images/send-circle.svg'
import Close from '../../../assets/images/close.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Text from '../../../components/Text'
import { SendType } from './sendTypes'

type Props = {
  type: SendType
  onClosePress: () => void
  flex?: number
}

const SendHeader = ({ type, onClosePress, flex }: Props) => {
  const { t } = useTranslation()

  return (
    <Box
      flex={flex}
      backgroundColor="primaryBackground"
      justifyContent="flex-start"
      alignItems="center"
      padding="l"
    >
      <Box flexDirection="row" justifyContent="flex-end" width="100%">
        <TouchableOpacityBox padding="m" onPress={onClosePress}>
          <Close color="white" width={22} height={22} />
        </TouchableOpacityBox>
      </Box>
      <Box marginBottom="m">
        <SendCircle />
      </Box>
      <Text variant="h1">
        {type === 'payment' && t('send.title.payment')}
        {type === 'dc_burn' && t('send.title.dcBurn')}
      </Text>
    </Box>
  )
}

export default SendHeader
