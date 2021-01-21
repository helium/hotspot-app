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
  <Box flexDirection="row" justifyContent="space-between" paddingTop="m">
    <TouchableOpacityBox
      onPress={onFollowSelected}
      paddingVertical="s"
      paddingHorizontal="l"
    >
      <Heart />
    </TouchableOpacityBox>
    <CardHandle />
    <TouchableOpacityBox
      onPress={onMoreSelected}
      paddingVertical="s"
      paddingHorizontal="l"
    >
      <MoreMenu />
    </TouchableOpacityBox>
  </Box>
)

export default HotspotDetailCardHeader
