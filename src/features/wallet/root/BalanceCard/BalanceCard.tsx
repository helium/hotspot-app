import React from 'react'
import { useAsync } from 'react-async-hook'
import QRCode from 'react-qr-code'
import { useSelector } from 'react-redux'
import { CurrencyType } from '@helium/currency'
import { RootState } from '../../../../store/rootReducer'
import Box from '../../../../components/Box'
import AnimatedBox from '../../../../components/AnimatedBox'
import Text from '../../../../components/Text'
import CurrencyBadge from './CurrencyBadge'
import WalletButton from './WalletButton'
import { getAddress } from '../../../../utils/secureAccount'
import { hp, wp } from '../../../../utils/layout'
import ShareButton from './ShareButton'
import { WalletLayout } from '../walletLayout'
import { decimalSeparator, groupSeparator } from '../../../../utils/i18n'
import Address from '../../../../components/Address'

type Props = {
  onReceivePress: () => void
  onSendPress: () => void
  layout: WalletLayout
}

const BalanceCard = ({ onReceivePress, onSendPress, layout }: Props) => {
  const { result: address, loading: loadingAddress } = useAsync(getAddress, [])
  const {
    account: { account },
  } = useSelector((state: RootState) => state)

  const hasBalance = account?.balance?.integerBalance !== 0
  const [integerPart, decimalPart] =
    account?.balance
      ?.toString(undefined, {
        decimalSeparator,
        groupSeparator,
        showTicker: false,
      })
      .split(decimalSeparator) || []

  return (
    <Box
      backgroundColor="purple200"
      paddingVertical="xs"
      paddingHorizontal="l"
      borderTopRightRadius="l"
      borderTopLeftRadius="l"
      flex={1}
    >
      <Box height={layout.balanceHeight} justifyContent="center">
        <AnimatedBox
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Text
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.2}
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
              {[
                decimalSeparator,
                decimalPart || '00000000',
                ' ',
                CurrencyType.networkToken.ticker,
              ].join('')}
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

        <Box
          flexDirection="row"
          paddingTop="m"
          height={layout.altCurrencyHeight}
        >
          <CurrencyBadge
            variant="dc"
            amount={account?.dcBalance?.integerBalance || 0}
          />
          <CurrencyBadge
            variant="hst"
            amount={account?.secBalance?.floatBalance || 0}
          />
        </Box>
      </Box>

      <Box
        justifyContent="flex-start"
        alignItems="center"
        marginVertical="m"
        minHeight={layout.qrSendHeight + layout.sendShareArea}
      >
        <Box backgroundColor="white" padding="s" borderRadius="m">
          {!loadingAddress && (
            <QRCode value={address?.b58 || ''} size={layout.qrSendHeight} />
          )}
        </Box>
        <Box width="100%" marginTop="m" alignItems="center">
          <Address
            address={address?.b58}
            maxWidth={200}
            color="white"
            variant="body1Mono"
            padding="s"
            clickToCopy
          />
          <ShareButton address={address?.b58 || ''} />
        </Box>
      </Box>
    </Box>
  )
}

export default BalanceCard
