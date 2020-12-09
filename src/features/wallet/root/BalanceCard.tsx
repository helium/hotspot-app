import React from 'react'
import { Animated } from 'react-native'
import Haptic from 'react-native-haptic-feedback'
import Box from '../../../components/Box'
import AnimatedBox from '../../../components/AnimatedBox'
import Text from '../../../components/Text'
import CurrencyBadge from './CurrencyBadge'
import WalletButton from './WalletButton'

type Props = {
  translateY: Animated.AnimatedInterpolation
  scale: Animated.AnimatedInterpolation
}

const BalanceCard = ({ translateY, scale }: Props) => {
  const handlePress = () => {
    Haptic.trigger('notificationWarning')
  }
  return (
    <Box
      flex={1}
      backgroundColor="purple200"
      paddingVertical="xl"
      paddingHorizontal="l"
      borderRadius="l"
    >
      <AnimatedBox
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={[{ transform: [{ translateY }, { scale }] }]}
      >
        <Box>
          <Text color="white" fontSize={40} fontWeight="300">
            23,987
          </Text>
          <Text
            color="white"
            fontSize={16}
            fontWeight="300"
            opacity={0.4}
            lineHeight={25}
          >
            .45876891 HNT
          </Text>
        </Box>

        <Box flexDirection="row" justifyContent="space-between" width={130}>
          <WalletButton variant="receive" onPress={handlePress} />
          <WalletButton variant="send" onPress={handlePress} />
        </Box>
      </AnimatedBox>

      <Box flexDirection="row" marginTop="m">
        <CurrencyBadge variant="dc" amount={1032935734} />
        <CurrencyBadge variant="hst" amount={20} />
      </Box>
    </Box>
  )
}

export default BalanceCard
