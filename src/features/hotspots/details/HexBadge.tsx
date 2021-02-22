import React, { useCallback } from 'react'
import { Linking } from 'react-native'
import Hex from '@assets/images/hex.svg'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { decimalSeparator, locale } from '../../../utils/i18n'

type Props = {
  rewardScale?: number
}
const HexBadge = ({ rewardScale }: Props) => {
  const handlePress = useCallback(() => {
    Linking.openURL(
      'https://docs.helium.com/blockchain/proof-of-coverage/#poc-reward-scaling',
    )
  }, [])

  if (!rewardScale) return null

  const scaleString =
    rewardScale === 1
      ? `1${decimalSeparator}00`
      : rewardScale.toLocaleString(locale, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        })

  return (
    <TouchableOpacityBox
      onPress={handlePress}
      backgroundColor="purpleMain"
      borderRadius="s"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingStart="s"
      height="100%"
      marginLeft="s"
    >
      <Hex color="white" width={14} />
      <Text color="white" variant="body2Medium" padding="s">
        {scaleString}
      </Text>
    </TouchableOpacityBox>
  )
}

export default HexBadge
