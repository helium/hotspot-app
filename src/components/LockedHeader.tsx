import React from 'react'
import Box from './Box'
import { Colors } from '../theme/theme'
import Close from '../assets/images/close.svg'
import TouchableOpacityBox from './TouchableOpacityBox'
import Text from './Text'

type Props = {
  backgroundColor: Colors
  onClosePress: () => void
  allowClose?: boolean
  text: string
}

const SendLockedHeader = ({
  backgroundColor,
  onClosePress,
  allowClose = true,
  text,
}: Props) => {
  return (
    <Box
      backgroundColor={backgroundColor}
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
        {text}
      </Text>
      {allowClose && (
        <TouchableOpacityBox
          onPress={onClosePress}
          paddingVertical="s"
          paddingHorizontal="m"
        >
          <Close color="white" width={10} height={10} />
        </TouchableOpacityBox>
      )}
    </Box>
  )
}

export default SendLockedHeader
