import React from 'react'
import { useAsync } from 'react-async-hook'
import QRCode from 'react-qr-code'
import Box from '../../../components/Box'
import AnimatedBox from '../../../components/AnimatedBox'
import Text from '../../../components/Text'
import CurrencyBadge from './CurrencyBadge'
import WalletButton from './WalletButton'
import { getAddress } from '../../../utils/secureAccount'
import { hp, wp } from '../../../utils/layout'

type Props = {
  onReceivePress: () => void
  onSendPress: () => void
}

const BalanceCard = ({ onReceivePress, onSendPress }: Props) => {
  const { result: address, loading: loadingAddress } = useAsync(getAddress, [])

  return (
    <Box
      flex={1}
      backgroundColor="purple200"
      paddingVertical="xs"
      paddingHorizontal="l"
      borderRadius="l"
    >
      <Box height={hp(18)} justifyContent="center">
        <AnimatedBox
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Text
              adjustsFontSizeToFit
              color="white"
              fontSize={hp(4.5)}
              fontWeight="300"
            >
              23,987
            </Text>
            <Text
              color="white"
              fontSize={hp(1.8)}
              fontWeight="300"
              opacity={0.4}
              lineHeight={25}
            >
              .45876891 HNT
            </Text>
          </Box>

          <Box
            flexDirection="row"
            justifyContent="space-between"
            width={wp(30)}
          >
            <WalletButton variant="receive" onPress={onReceivePress} />
            <WalletButton variant="send" onPress={onSendPress} />
          </Box>
        </AnimatedBox>

        <Box flexDirection="row" marginTop="m">
          <CurrencyBadge variant="dc" amount={1032935734} />
          <CurrencyBadge variant="hst" amount={20} />
        </Box>
      </Box>

      <Box
        flex={1}
        justifyContent="flex-start"
        alignItems="center"
        paddingTop="m"
      >
        <Box backgroundColor="white" padding="s" borderRadius="m">
          {!loadingAddress && <QRCode value={address?.b58} size={hp(14)} />}
        </Box>
      </Box>
    </Box>
  )
}

export default BalanceCard
