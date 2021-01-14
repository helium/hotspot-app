import React from 'react'
import Box from '../../../components/Box'
import CardHandle from '../../wallet/root/CardHandle'
import Heart from '../../../assets/images/heart.svg'
import MoreMenu from '../../../assets/images/moreMenu.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

type Props = {
  onMoreSelected: () => void
  onFollowSelected: () => void
}

const HotspotDetailCardHeader = ({
  onFollowSelected,
  onMoreSelected,
}: Props) => (
  <Box padding="m">
    <Box flexDirection="row" justifyContent="space-between" padding="s">
      <TouchableOpacityBox onPress={onFollowSelected}>
        <Heart />
      </TouchableOpacityBox>
      <CardHandle />
      <TouchableOpacityBox onPress={onMoreSelected}>
        <MoreMenu />
      </TouchableOpacityBox>
    </Box>
  </Box>
)

export default HotspotDetailCardHeader
