import React from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../components/Text'

const NotificationList = () => {
  const { t } = useTranslation()
  return (
    <Text variant="h3" marginVertical="m">
      {t('notifications.list.title')}
    </Text>
  )
}

export default NotificationList
