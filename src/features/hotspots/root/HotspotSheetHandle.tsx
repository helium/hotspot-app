import { Hotspot, Witness } from '@helium/http'
import React, { memo } from 'react'
import Box from '../../../components/Box'
import CardHandle from '../../../components/CardHandle'
import FollowButton from '../../../components/FollowButton'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Settings from '../../../assets/images/settings.svg'
import { useColors } from '../../../theme/themeHooks'

export const HOTSPOT_SHEET_HANDLE_HEIGHT = 52

type Props = { hotspot?: Hotspot | Witness; toggleSettings?: () => void }
const HotspotDetailsHandle = ({ hotspot, toggleSettings }: Props) => {
  const colors = useColors()
  const showHotspotOptions = hotspot && hotspot.address
  return (
    <Box
      flexDirection="row"
      flex={1}
      justifyContent={showHotspotOptions ? 'space-between' : 'center'}
      alignItems="center"
      paddingHorizontal="m"
      height={HOTSPOT_SHEET_HANDLE_HEIGHT}
    >
      {showHotspotOptions && hotspot && (
        <FollowButton address={hotspot.address} />
      )}
      <Box height={22} justifyContent="center">
        <CardHandle />
      </Box>
      {showHotspotOptions && (
        <TouchableOpacityBox
          onPress={toggleSettings}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
        >
          <Settings width={22} height={22} color={colors.grayPurple} />
        </TouchableOpacityBox>
      )}
    </Box>
  )
}

export default memo(HotspotDetailsHandle)
