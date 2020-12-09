import React from 'react'
import { TouchableOpacity } from 'react-native'
import Box from '../../../components/Box'
import Send from '../../../assets/images/send.svg'
import Receive from '../../../assets/images/receive.svg'

type Props = {
  variant: 'send' | 'receive'
  onPress?: () => void
}

const WalletButton = ({ variant, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Box
      backgroundColor="purple300"
      width={55}
      height={55}
      borderRadius="round"
      alignItems="center"
      justifyContent="center"
    >
      {variant === 'send' && <Send width={25} />}
      {variant === 'receive' && <Receive width={25} />}
    </Box>
  </TouchableOpacity>
)

export default WalletButton
