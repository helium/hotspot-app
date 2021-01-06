import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from './Box'
import Close from '../assets/images/close.svg'
import TouchableOpacityBox from './TouchableOpacityBox'
import Text from './Text'

type Props = {
  onClosePress: () => void
}

const SendLockedHeader = ({ onClosePress }: Props) => {
  const { t } = useTranslation()

  return (
    <Box
      backgroundColor="blueMain"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingVertical="xs"
      borderTopLeftRadius="m"
      borderTopRightRadius="m"
    >
      <Text
        variant="body1Bold"
        paddingHorizontal="m"
        fontSize={14}
        letterSpacing={0.85}
      >
        {t('send.qrInfo')}
      </Text>
      <TouchableOpacityBox
        onPress={onClosePress}
        paddingVertical="s"
        paddingHorizontal="m"
      >
        <Close color="white" width={10} height={10} />
      </TouchableOpacityBox>
    </Box>
  )
}

export default SendLockedHeader
