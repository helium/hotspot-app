/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import SendCircle from '@assets/images/sendCircle.svg'
import ReceiveCircle from '@assets/images/receiveCircle.svg'
import { Account } from '@helium/http'
import { BoxProps } from '@shopify/restyle'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import CurrencyBadge from './CurrencyBadge'
import { hp } from '../../../../utils/layout'
import { DebouncedTouchableOpacityBox } from '../../../../components/TouchableOpacityBox'
import { Theme } from '../../../../theme/theme'

type Props = BoxProps<Theme> & {
  onReceivePress: () => void
  onSendPress: () => void
  balanceInfo: {
    hasBalance: boolean
    integerPart: string
    decimalPart: string
  }
  account?: Account
  accountLoading: boolean
  toggleConvertHntToCurrency: () => void
}

const BalanceCard = ({
  onReceivePress,
  onSendPress,
  balanceInfo,
  account,
  accountLoading,
  toggleConvertHntToCurrency,
  ...boxProps
}: Props) => {
  return (
    <Box
      justifyContent="center"
      paddingVertical="xs"
      paddingHorizontal="l"
      {...boxProps}
    >
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {accountLoading ? (
          <SkeletonPlaceholder
            backgroundColor="#343964"
            highlightColor="#292E56"
          >
            <SkeletonPlaceholder.Item
              width={80}
              height={40}
              marginTop={8}
              borderRadius={8}
            />
            <SkeletonPlaceholder.Item
              width={150}
              height={16}
              marginTop={8}
              borderRadius={8}
            />
          </SkeletonPlaceholder>
        ) : (
          <Box onTouchStart={toggleConvertHntToCurrency} flex={1}>
            <Text
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.2}
              color="white"
              fontSize={hp(4.5)}
              numberOfLines={1}
              fontWeight="300"
            >
              {balanceInfo.integerPart}
            </Text>
            <Text
              color="white"
              fontSize={hp(1.8)}
              fontWeight="300"
              opacity={0.4}
              lineHeight={25}
            >
              {balanceInfo.decimalPart}
            </Text>
          </Box>
        )}

        <Box flexDirection="row" alignSelf="flex-start">
          <DebouncedTouchableOpacityBox
            onPress={onReceivePress}
            marginRight="s"
          >
            <ReceiveCircle />
          </DebouncedTouchableOpacityBox>
          <DebouncedTouchableOpacityBox onPress={onSendPress}>
            <SendCircle />
          </DebouncedTouchableOpacityBox>
        </Box>
      </Box>

      <Box flexDirection="row" paddingVertical="m">
        <CurrencyBadge
          variant="dc"
          amount={account?.dcBalance?.integerBalance}
        />
        <CurrencyBadge
          variant="hst"
          amount={account?.secBalance?.floatBalance}
        />
        <CurrencyBadge
          variant="stake"
          amount={account?.stakedBalance?.floatBalance}
        />
        <CurrencyBadge variant="mobile" amount={100} />
      </Box>
    </Box>
  )
}

export default memo(BalanceCard)
