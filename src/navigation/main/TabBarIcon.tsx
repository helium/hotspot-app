import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import Cog from '@assets/images/cog.svg'
import NotificationsNew from '@assets/images/notificationsNew.svg'
import Notifications from '@assets/images/notifications.svg'
import Hotspot from '@assets/images/hotspotIcon.svg'
import Account from '@assets/images/accountIcon.svg'
import AccountWarn from '@assets/images/accountIconWarn.svg'
import Box from '../../components/Box'
import { MainTabType, TabBarIconType } from './tabTypes'
import { useColors } from '../../theme/themeHooks'
import { RootState } from '../../store/rootReducer'
import { hasTimePassed } from '../../utils/timeUtils'

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
  const lastSolanaNotification = useSelector(
    (state: RootState) => state.app.lastSolanaNotification,
  )
  const hideSolanaNotification = useSelector(
    (state: RootState) => state.app.hideSolanaNotification,
  )

  if (name === 'Hotspots') {
    return <Hotspot height={size} width={size} color={color} />
  }
  if (name === 'Wallet') {
    return !hideSolanaNotification && hasTimePassed(lastSolanaNotification) ? (
      <AccountWarn height={size} width={size} color={color} />
    ) : (
      <Account height={size} width={size} color={color} />
    )
  }
  if (name === 'Notifications') {
    const hasUnread = !!notifications.find((n) => !n.viewedAt)
    if (hasUnread) {
      return <NotificationsNew height={size} width={size} color={color} />
    }
    return <Notifications height={size} width={size} color={color} />
  }
  return <Cog color={color} height={size} width={size} />
}

const TabBarIcon = ({ name, focused, size }: Props) => {
  const { white, purpleDarkMuted } = useColors()
  const color = focused ? white : purpleDarkMuted

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
