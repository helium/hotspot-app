import { Hotspot, Witness } from '@helium/http'
import React, { memo } from 'react'
import Box from '../../../components/Box'
import CardHandle from '../../../components/CardHandle'
import FollowButton from '../../../components/FollowButton'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Settings from '../../../assets/images/settings.svg'
import { useColors } from '../../../theme/themeHooks'
import ShareSheet from '../../../components/ShareSheet'

type Props = {
  hotspot?: Hotspot | Witness
  toggleSettings?: () => void
}
const HotspotSheetHandle = ({ hotspot, toggleSettings }: Props) => {
  const colors = useColors()
  const showHotspotOptions = hotspot && hotspot.address

  if (!showHotspotOptions) return null
  return (
    <Box
      flexDirection="row"
      flex={1}
      justifyContent="flex-end"
      alignItems="center"
      paddingTop="l"
      backgroundColor="white"
    >
      <Box
        position="absolute"
        height={22}
        paddingTop="s"
        justifyContent="center"
        alignItems="center"
        top={0}
        bottom={0}
        left={0}
        right={0}
      >
        <CardHandle />
      </Box>
      {showHotspotOptions && hotspot && (
        <Box flexDirection="row" alignItems="center">
          <FollowButton address={hotspot.address} />
          <TouchableOpacityBox
            onPress={toggleSettings}
            marginLeft="m"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Settings width={22} height={22} color={colors.grayPurple} />
          </TouchableOpacityBox>
          <ShareSheet item={hotspot} />
        </Box>
      )}
    </Box>
  )
}

export default memo(HotspotSheetHandle)
