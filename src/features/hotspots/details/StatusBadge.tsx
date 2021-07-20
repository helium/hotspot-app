import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Insets } from 'react-native'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { Colors } from '../../../theme/theme'
import { HotspotSyncStatus } from '../../../utils/hotspotUtils'

type Props = {
  online?: string
  onPress: () => void
  syncStatus?: HotspotSyncStatus | null
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
      if (syncStatus === undefined) {
        return ''
      }
      if (syncStatus === 'full') {
        return t('hotspot_details.status_online')
      }
      return t('hotspot_details.status_syncing')
    }
    return t('hotspot_details.status_offline')
  }, [online, syncStatus, t])

  const backgroundColor = useMemo((): Colors => {
    if (online === 'offline') return 'orangeDark'

    if (!syncStatus) return 'white'
    return 'greenOnline'
  }, [online, syncStatus])

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
      disabled={syncStatus === 'full'}
    >
      <Text color="white" variant="regular" fontSize={14}>
        {title}
      </Text>
    </TouchableOpacityBox>
  )
}

export default StatusBadge
