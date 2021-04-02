import { Hotspot } from '@helium/http'
import React, { memo } from 'react'
import Box from '../../../components/Box'
import CardHandle from '../../../components/CardHandle'
import HotspotMoreMenuButton from './HotspotMoreMenuButton'
import FollowButton from '../../../components/FollowButton'

type Props = { hotspot: Hotspot }
const HotspotDetailsHandle = ({ hotspot }: Props) => {
  return (
    <Box
      flexDirection="row"
      flex={1}
      justifyContent="space-between"
      alignItems="center"
    >
      <FollowButton
        paddingHorizontal="l"
        paddingVertical="m"
        address={hotspot.address}
      />
      <CardHandle />
      <HotspotMoreMenuButton hotspot={hotspot} />
    </Box>
  )
}

export default memo(HotspotDetailsHandle)
