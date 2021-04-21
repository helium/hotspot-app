import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { SyncStatus } from '../../../utils/hotspotUtils'

type Props = {
  online?: string
  onPress: () => void
  syncStatus?: SyncStatus
}
const StatusBadge = ({ online = 'offline', onPress, syncStatus }: Props) => {
  const { t } = useTranslation()
  const needsAttention = useMemo(
    () => online === 'online' && syncStatus === SyncStatus.full,
    [online, syncStatus],
  )

  return (
    <TouchableOpacityBox
      backgroundColor={needsAttention ? 'greenOnline' : 'orangeDark'}
      paddingHorizontal="s"
      borderRadius="ms"
      alignItems="center"
      justifyContent="center"
      onPress={onPress}
      disabled={syncStatus === SyncStatus.full && online === 'online'}
    >
      <Text color="white" variant="regular" fontSize={13}>
        {t(
          needsAttention
            ? 'hotspot_details.status_online'
            : 'hotspot_details.status_offline',
        )}
      </Text>
    </TouchableOpacityBox>
  )
}

export default StatusBadge
