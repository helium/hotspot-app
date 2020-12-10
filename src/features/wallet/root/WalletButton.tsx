import React from 'react'
import { TouchableOpacity } from 'react-native'
import Box from '../../../components/Box'
import Send from '../../../assets/images/send.svg'
import Receive from '../../../assets/images/receive.svg'
import { wp } from '../../../utils/layout'

type Props = {
  variant: 'send' | 'receive'
  onPress?: () => void
}

const WalletButton = ({ variant, onPress }: Props) => (
  <TouchableOpacity onPress={onPress}>
    <Box
      backgroundColor="purple300"
      width={wp(13)}
      height={wp(13)}
      borderRadius="round"
      alignItems="center"
      justifyContent="center"
    >
      {variant === 'send' && <Send width={wp(5.5)} />}
      {variant === 'receive' && <Receive width={wp(5.5)} />}
    </Box>
  </TouchableOpacity>
)

export default WalletButton
