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
      paddingHorizontal="s"
      borderRadius="ms"
      alignItems="center"
      justifyContent="center"
      height={30}
    >
      <Text color="white" variant="regular" fontSize={13}>
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
