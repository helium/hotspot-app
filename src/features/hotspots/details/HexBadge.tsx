import React, { useCallback } from 'react'
import { Linking } from 'react-native'
import Hex from '@assets/images/hex.svg'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

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

  return (
    <TouchableOpacityBox
      onPress={handlePress}
      backgroundColor="purpleMain"
      padding="s"
      borderRadius="s"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      width={66}
      height={33}
      marginLeft="s"
    >
      <Hex color="white" width={14} />
      <Text color="white" variant="body2Medium">
        {rewardScale.toFixed(2)}
      </Text>
    </TouchableOpacityBox>
  )
}

export default HexBadge
