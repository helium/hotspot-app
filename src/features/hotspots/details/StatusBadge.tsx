import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Insets } from 'react-native'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { Colors } from '../../../theme/theme'
import { HotspotSyncStatus } from '../root/hotspotTypes'

type Props = {
  online?: string
  onPress?: () => void
  syncStatus?: HotspotSyncStatus
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
      if (syncStatus === 'full') {
        return t('hotspot_details.status_online')
      }
      return t('hotspot_details.status_syncing')
    }
    return t('hotspot_details.status_offline')
  }, [online, syncStatus, t])

  const backgroundColor = useMemo((): Colors => {
    if (online !== 'online') return 'orangeDark'

    return 'greenOnline'
  }, [online])

  return (
    <TouchableOpacityBox
      backgroundColor={backgroundColor}
      paddingHorizontal="s"
      hitSlop={hitSlop}
      borderRadius="l"
      alignItems="center"
      justifyContent="center"
      onPress={onPress}
      minWidth={60}
      disabled={syncStatus === 'full' && online === 'online'}
    >
      <Text color="white" variant="regular" fontSize={14}>
        {title}
      </Text>
    </TouchableOpacityBox>
  )
}

export default StatusBadge
