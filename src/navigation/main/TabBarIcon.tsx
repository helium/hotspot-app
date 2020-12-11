import React from 'react'
import Box from '../../components/Box'
import HotspotsSvg from './icons/HotspotsSvg'
import AccountSvg from './icons/AccountSvg'
import NotificationsSvg from './icons/NotificationsSvg'
import MoreSvg from './icons/MoreSvg'
import { MainTabType, TabBarIconType } from './tabTypes'
import { useColors } from '../../theme/themeHooks'

type Props = {
  name: MainTabType
} & TabBarIconType

const Icon = ({
  size,
  color,
  name,
}: {
  color: string
  size: number
  name: MainTabType
}) => {
  if (name === 'Hotspots') return <HotspotsSvg color={color} size={size} />
  if (name === 'Wallet') return <AccountSvg size={size} color={color} />
  if (name === 'Notifications')
    return <NotificationsSvg size={size} color={color} />
  return <MoreSvg color={color} size={size} />
}

const TabBarIcon = ({ name, focused, size }: Props) => {
  const { blueGrayLight, purpleMain } = useColors()
  const color = focused ? purpleMain : blueGrayLight

  return (
    <Box
      alignItems="center"
      flex={1}
      justifyContent="center"
      padding="xxxs"
      paddingTop="s"
    >
      <Icon size={size} color={color} name={name} />
    </Box>
  )
}

export default TabBarIcon
