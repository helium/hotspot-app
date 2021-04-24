import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import Box from '../../components/Box'
import HotspotsSvg from './icons/HotspotsSvg'
import AccountSvg from './icons/AccountSvg'
import NotificationsReadSvg from './icons/NotificationsReadSvg'
import NotificationsNewSvg from './icons/NotificationsNewSvg'
import MoreSvg from './icons/MoreSvg'
import { MainTabType, TabBarIconType } from './tabTypes'
import { useColors } from '../../theme/themeHooks'
import { RootState } from '../../store/rootReducer'

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
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications,
  )

  if (name === 'Hotspots') {
    return <HotspotsSvg color={color} size={size} />
  }
  if (name === 'Wallet') {
    return <AccountSvg size={size} color={color} />
  }
  if (name === 'Notifications') {
    const hasUnread = !!notifications.find((n) => !n.viewed_at)
    if (hasUnread) {
      return <NotificationsNewSvg size={size} color={color} />
    }
    return <NotificationsReadSvg size={size} color={color} />
  }
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

export default memo(TabBarIcon)
