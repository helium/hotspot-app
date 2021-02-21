import React from 'react'
import { useAsync } from 'react-async-hook'
import QRCode from 'react-qr-code'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store/rootReducer'
import Box from '../../../../components/Box'
import AnimatedBox from '../../../../components/AnimatedBox'
import Text from '../../../../components/Text'
import CurrencyBadge from './CurrencyBadge'
import WalletButton from './WalletButton'
import { getAddress } from '../../../../utils/secureAccount'
import { hp, wp } from '../../../../utils/layout'
import CopyAddressButton from './AddressCopyButton'
import ShareButton from './ShareButton'

type Props = {
  onReceivePress: () => void
  onSendPress: () => void
}

const BalanceCard = ({ onReceivePress, onSendPress }: Props) => {
  const { result: address, loading: loadingAddress } = useAsync(getAddress, [])
  const {
    account: { account },
  } = useSelector((state: RootState) => state)

  const hasBalance = account?.balance?.integerBalance !== 0
  const [integerPart, decimalPart] =
    account?.balance?.toString().split('.') || []

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
              {hasBalance ? integerPart : '0'}
            </Text>
            <Text
              color="white"
              fontSize={hp(1.8)}
              fontWeight="300"
              opacity={0.4}
              lineHeight={25}
            >
              .{hasBalance ? decimalPart : '00000000 HNT'}
            </Text>
          </Box>

          <Box
            flexDirection="row"
            justifyContent="space-between"
            width={wp(30)}
          >
            <WalletButton variant="receive" onPress={onReceivePress} />
            <WalletButton
              variant="send"
              onPress={onSendPress}
              disabled={!hasBalance}
            />
          </Box>
        </AnimatedBox>

        <Box flexDirection="row" marginTop="m">
          <CurrencyBadge
            variant="dc"
            amount={account?.dcBalance?.integerBalance || 0}
          />
          <CurrencyBadge
            variant="hst"
            amount={
              account?.secBalance
                ? parseFloat(account.secBalance.toString())
                : 0
            }
          />
        </Box>
      </Box>

      <Box
        flex={1}
        justifyContent="flex-start"
        alignItems="center"
        paddingTop="m"
      >
        <Box backgroundColor="white" padding="s" borderRadius="m">
          {!loadingAddress && (
            <QRCode value={address?.b58 || ''} size={hp(14)} />
          )}
        </Box>
        <Box width="100%" marginTop="m" alignItems="center">
          <CopyAddressButton address={address?.b58} />
          <ShareButton address={address?.b58 || ''} />
        </Box>
      </Box>
    </Box>
  )
}

export default BalanceCard
