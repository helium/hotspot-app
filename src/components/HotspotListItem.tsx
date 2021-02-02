import { Hotspot } from '@helium/http'
import Balance, { NetworkTokens } from '@helium/currency'
import animalName from 'angry-purple-tiger'
import React from 'react'
import { useColors } from '../theme/themeHooks'
import TouchableOpacityBox from './BSTouchableOpacityBox'
import Box from './Box'
import CheckCircle from '../assets/images/check-circle.svg'
import CarotRight from '../assets/images/carot-right.svg'
import Text from './Text'
import CircleProgress from './CircleProgress'

type HotspotListItemProps = {
  onPress?: (hotspot: Hotspot) => void
  hotspot: Hotspot
  totalReward: Balance<NetworkTokens>
  showCarot?: boolean
}

const HotspotListItem = ({
  onPress,
  hotspot,
  totalReward,
  showCarot = false,
}: HotspotListItemProps) => {
  const { grayBox } = useColors()
  return (
    <TouchableOpacityBox
      backgroundColor="grayBox"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding="m"
      borderRadius="m"
      height={75}
      onPress={() => onPress?.(hotspot)}
    >
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        flex={1}
      >
        <Box flexDirection="column">
          <Box flexDirection="row" alignItems="center">
            <CheckCircle width={17} height={17} />
            <Text
              variant="body2Medium"
              color="black"
              paddingStart="s"
              ellipsizeMode="tail"
              numberOfLines={2}
              maxWidth={210}
            >
              {animalName(hotspot.address)}
            </Text>
          </Box>
          <Text variant="body2" color="purpleMain" paddingTop="s">
            {`+${totalReward.toString(2)}`}
          </Text>
        </Box>
        {/* TODO: Update percentage to use hotspot on-boarding progress */}
        <Box flexDirection="row" alignItems="center" justifyContent="center">
          <CircleProgress percentage={50} centerColor={grayBox} />
          {showCarot && (
            <Box marginStart="m">
              <CarotRight color="#C4C8E5" />
            </Box>
          )}
        </Box>
      </Box>
    </TouchableOpacityBox>
  )
}

export default HotspotListItem
