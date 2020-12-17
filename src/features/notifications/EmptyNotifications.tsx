import React from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../components/Text'
import BellBubble from '../../assets/images/bellBubble.svg'
import Box from '../../components/Box'

const EmptyNotifications = () => {
  const { t } = useTranslation()
  return (
    <Box justifyContent="center" flex={1} paddingHorizontal="l">
      <BellBubble />
      <Text variant="h2" marginVertical="m">
        {t('notifications.none.title')}
      </Text>
      <Text variant="subtitle">{t('notifications.none.subtitle')}</Text>
    </Box>
  )
}

export default EmptyNotifications
