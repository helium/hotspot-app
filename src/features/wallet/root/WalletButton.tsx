import React from 'react'
import Send from '../../../assets/images/send.svg'
import Receive from '../../../assets/images/receive.svg'
import { wp } from '../../../utils/layout'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

type Props = {
  variant: 'send' | 'receive'
  onPress?: () => void
}

const WalletButton = ({ variant, onPress }: Props) => (
  <TouchableOpacityBox
    onPress={onPress}
    backgroundColor="purple300"
    width={wp(13)}
    height={wp(13)}
    borderRadius="round"
    alignItems="center"
    justifyContent="center"
  >
    {variant === 'send' && <Send width={wp(5.5)} />}
    {variant === 'receive' && <Receive width={wp(5.5)} />}
  </TouchableOpacityBox>
)

export default WalletButton
