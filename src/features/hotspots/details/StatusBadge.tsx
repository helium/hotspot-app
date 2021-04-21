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

  const title = useMemo(() => {
    if (online === 'online') {
      if (syncStatus === SyncStatus.full) {
        return t('hotspot_details.status_online')
      }
      return t('hotspot_details.status_syncing')
    }
    return t('hotspot_details.status_offline')
  }, [online, syncStatus, t])

  return (
    <TouchableOpacityBox
      backgroundColor={online === 'online' ? 'greenOnline' : 'orangeDark'}
      paddingHorizontal="s"
      borderRadius="ms"
      alignItems="center"
      justifyContent="center"
      onPress={onPress}
      disabled={syncStatus === SyncStatus.full && online === 'online'}
    >
      <Text color="white" variant="regular" fontSize={13}>
        {title}
      </Text>
    </TouchableOpacityBox>
  )
}

export default StatusBadge
