import React from 'react'
import { useSelector } from 'react-redux'
import SafeAreaBox from '../../components/SafeAreaBox'
import { RootState } from '../../store/rootReducer'
import NoNotifications from './NoNotifications'
import NotificationList from './NotificationList'

const NotificationsScreen = () => {
  const {
    account: { notifications },
  } = useSelector((state: RootState) => state)

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      paddingHorizontal="l"
      flex={1}
    >
      {notifications.length > 0 && <NotificationList />}
      {notifications.length === 0 && <NoNotifications />}
    </SafeAreaBox>
  )
}

export default NotificationsScreen
