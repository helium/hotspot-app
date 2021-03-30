import { Hotspot } from '@helium/http'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import CardHandle from '../../../components/CardHandle'
import { DebouncedTouchableOpacityBox } from '../../../components/TouchableOpacityBox'
import { useColors } from '../../../theme/themeHooks'
import HotspotMoreMenuButton from './HotspotMoreMenuButton'
import Follow from '../../../assets/images/follow.svg'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import {
  unfollowHotspot,
  followHotspot,
} from '../../../store/hotspots/hotspotsSlice'

type Props = { hotspot: Hotspot }
const HotspotDetailsHandle = ({ hotspot }: Props) => {
  const { grayPurple, followPurple } = useColors()
  const dispatch = useAppDispatch()
  const [following, setFollowing] = useState(false)
  const followedHotspots = useSelector(
    (state: RootState) => state.hotspots.followedHotspotsObj,
  )

  useEffect(() => {
    setFollowing(!!followedHotspots[hotspot.address])
  }, [followedHotspots, hotspot.address])

  const color = useMemo(() => (following ? followPurple : grayPurple), [
    following,
    followPurple,
    grayPurple,
  ])

  const toggleFollowing = useCallback(() => {
    if (following) {
      setFollowing(false)
      dispatch(unfollowHotspot(hotspot.address))
    } else {
      setFollowing(true)
      dispatch(followHotspot(hotspot.address))
    }
  }, [dispatch, hotspot.address, following])

  return (
    <Box
      flexDirection="row"
      flex={1}
      justifyContent="space-between"
      alignItems="center"
    >
      <DebouncedTouchableOpacityBox
        duration={1000}
        onPress={toggleFollowing}
        paddingHorizontal="l"
        paddingVertical="m"
      >
        <Follow color={color} />
      </DebouncedTouchableOpacityBox>
      <CardHandle />
      <HotspotMoreMenuButton hotspot={hotspot} />
    </Box>
  )
}

export default memo(HotspotDetailsHandle)
