import React, { useCallback } from 'react'
import { Linking } from 'react-native'
import Hex from '@assets/images/hex.svg'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { decimalSeparator, locale } from '../../../utils/i18n'
import { useColors } from '../../../theme/themeHooks'

type Props = {
  rewardScale?: number
}
const HexBadge = ({ rewardScale }: Props) => {
  const { greenOnline } = useColors()
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
      backgroundColor="grayBox"
      borderRadius="ms"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      width={59}
      height={30}
      marginLeft="xs"
    >
      <Hex color={greenOnline} width={14} />
      <Text color="grayText" variant="regular" fontSize={13} marginLeft="xs">
        {scaleString}
      </Text>
    </TouchableOpacityBox>
  )
}

export default HexBadge
