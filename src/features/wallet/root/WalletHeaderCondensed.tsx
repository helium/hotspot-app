/* eslint-disable react/jsx-props-no-spreading */
import { BoxProps } from '@shopify/restyle'
import React, { memo } from 'react'
import { LayoutChangeEvent } from 'react-native'
import SendCircle from '@assets/images/sendCircle.svg'
import ReceiveCircle from '@assets/images/receiveCircle.svg'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { DebouncedTouchableOpacityBox } from '../../../components/TouchableOpacityBox'
import { Theme } from '../../../theme/theme'
import useCurrency from '../../../utils/useCurrency'

type Props = BoxProps<Theme> & {
  onLayout: (event: LayoutChangeEvent) => void
  onReceivePress: () => void
  onSendPress: () => void
  balance: {
    hasBalance: boolean
    integerPart: string
    decimalPart: string
    phrase: string
  }
}
const WalletHeaderCondensed = ({
  onReceivePress,
  onSendPress,
  balance,
  ...boxProps
}: Props) => {
  const { toggleConvertHntToCurrency } = useCurrency()
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      padding="l"
      backgroundColor="primaryBackground"
      zIndex={1}
      {...boxProps}
    >
      <Text
        flex={1}
        variant="h1"
        color="white"
        fontSize={22}
        maxFontSizeMultiplier={1.2}
        onPress={toggleConvertHntToCurrency}
      >
        {`${balance.phrase}`}
      </Text>

      <DebouncedTouchableOpacityBox onPress={onReceivePress} marginRight="s">
        <ReceiveCircle height={42} width={42} />
      </DebouncedTouchableOpacityBox>
      <DebouncedTouchableOpacityBox
        onPress={onSendPress}
        disabled={!balance.hasBalance}
      >
        <SendCircle height={42} width={42} />
      </DebouncedTouchableOpacityBox>
    </Box>
  )
}

export default memo(WalletHeaderCondensed)
