import React from 'react'
import Receive from '@assets/images/receive.svg'
import Send from '@assets/images/send.svg'
import { wp } from '../../../../utils/layout'
import TouchableHighlightBox from '../../../../components/TouchableHighlightBox'
import Box from '../../../../components/Box'

type Props = {
  variant: 'send' | 'receive'
  onPress?: () => void
}

const WalletButton = ({ variant, onPress }: Props) => (
  <TouchableHighlightBox
    onPress={onPress}
    underlayColor="white"
    width={wp(13)}
    height={wp(13)}
    borderRadius="round"
  >
    <Box
      backgroundColor="purple300"
      flex={1}
      borderRadius="round"
      alignItems="center"
      justifyContent="center"
    >
      {variant === 'send' && <Send width={wp(5.5)} />}
      {variant === 'receive' && <Receive width={wp(5.5)} />}
    </Box>
  </TouchableHighlightBox>
)

export default WalletButton
