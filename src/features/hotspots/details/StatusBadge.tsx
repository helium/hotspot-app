import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

type Props = {
  online?: string
}
const StatusBadge = ({ online = 'offline' }: Props) => {
  const { t } = useTranslation()
  return (
    <Box
      backgroundColor={online === 'online' ? 'greenOnline' : 'yellow'}
      padding="s"
      borderRadius="s"
      alignSelf="baseline"
    >
      <Text color="white">
        {t(
          online === 'online'
            ? 'hotspot_details.status_online'
            : 'hotspot_details.status_offline',
        )}
      </Text>
    </Box>
  )
}

export default StatusBadge
