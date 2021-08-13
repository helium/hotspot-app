import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../components/Text'
import BellBubble from '../../assets/images/bellBubble.svg'
import Box from '../../components/Box'
import { NotificationFilter } from '../../store/notifications/notificationSlice'

const EmptyNotifications = ({ filter }: { filter: NotificationFilter }) => {
  const { t } = useTranslation()

  const text = useMemo(() => {
    switch (filter) {
      default:
      case NotificationFilter.ALL:
        return {
          title: t('notifications.none.title'),
          body: t('notifications.none.subtitle'),
        }
      case NotificationFilter.HELIUM_UPDATES:
        return {
          title: t('notifications.helium_updates_empty.title'),
          body: t('notifications.helium_updates_empty.subtitle'),
        }
      case NotificationFilter.HOTSPOT_UPDATES:
        return {
          title: t('notifications.hotspot_update_empty.title'),
          body: t('notifications.hotspot_update_empty.subtitle'),
        }
      case NotificationFilter.HOTSPOT_TRANSFER:
        return {
          title: t('notifications.transfers_empty.title'),
          body: t('notifications.transfers_empty.subtitle'),
        }
      case NotificationFilter.WEEKLY_EARNINGS:
        return {
          title: t('notifications.earnings_empty.title'),
          body: t('notifications.earnings_empty.subtitle'),
        }
      case NotificationFilter.FAILED_NOTIFICATIONS:
        return {
          title: t('notifications.failed_empty.title'),
          body: t('notifications.failed_empty.subtitle'),
        }
    }
  }, [filter, t])

  return (
    <Box justifyContent="center" flex={1}>
      <BellBubble />
      <Text variant="h2" marginVertical="m" color="black">
        {text.title}
      </Text>
      <Text variant="subtitle">{text.body}</Text>
    </Box>
  )
}

export default EmptyNotifications
