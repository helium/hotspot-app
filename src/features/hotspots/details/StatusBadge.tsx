import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Insets } from 'react-native'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { SyncStatus } from '../../../utils/hotspotUtils'

type Props = {
  online?: string
  onPress: () => void
  syncStatus?: SyncStatus
  hitSlop?: Insets
}

const StatusBadge = ({
  online = 'offline',
  onPress,
  syncStatus,
  hitSlop,
}: Props) => {
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
      hitSlop={hitSlop}
      borderRadius="l"
      alignItems="center"
      justifyContent="center"
      onPress={onPress}
    >
      <Text color="white" variant="regular" fontSize={14}>
        {title}
      </Text>
    </TouchableOpacityBox>
  )
}

export default StatusBadge
