import React from 'react'
import Receive from '@assets/images/receive.svg'
import Send from '@assets/images/send.svg'
import { wp } from '../../../../utils/layout'
import TouchableHighlightBox from '../../../../components/TouchableHighlightBox'
import Box from '../../../../components/Box'
import { useColors } from '../../../../theme/themeHooks'

type Props = {
  variant: 'send' | 'receive'
  onPress?: () => void
  disabled?: boolean
}

const WalletButton = ({ variant, onPress, disabled }: Props) => {
  const colors = useColors()
  return (
    <TouchableHighlightBox
      onPress={disabled ? undefined : onPress}
      underlayColor="white"
      width={wp(13)}
      height={wp(13)}
      borderRadius="round"
    >
      <Box
        backgroundColor={disabled ? 'purple400' : 'purple300'}
        flex={1}
        borderRadius="round"
        alignItems="center"
        justifyContent="center"
      >
        {variant === 'send' && (
          <Send
            width={wp(5.5)}
            color={disabled ? colors.purple500 : colors.blueBright}
          />
        )}
        {variant === 'receive' && (
          <Receive
            width={wp(5.5)}
            color={disabled ? colors.purple500 : colors.greenBright}
          />
        )}
      </Box>
    </TouchableHighlightBox>
  )
}

export default WalletButton
