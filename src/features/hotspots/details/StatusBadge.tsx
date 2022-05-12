import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Insets } from 'react-native'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { Colors } from '../../../theme/theme'

type Props = {
  online?: string
  onPress?: () => void
  isDataOnly: boolean
  hitSlop?: Insets
}

const StatusBadge = ({ online, isDataOnly, onPress, hitSlop }: Props) => {
  const { t } = useTranslation()

  const title = useMemo(() => {
    if (isDataOnly) {
      return t('hotspot_details.status_data_only')
    }
    if (online === 'online') {
      return t('hotspot_details.status_online')
    }
    return t('hotspot_details.status_offline')
  }, [isDataOnly, online, t])

  const textColor = useMemo((): Colors => {
    if (isDataOnly) return 'grayText'

    return 'white'
  }, [isDataOnly])

  const backgroundColor = useMemo((): Colors => {
    if (isDataOnly) return 'grayLight'

    if (online !== 'online') return 'orangeDark'

    return 'greenOnline'
  }, [isDataOnly, online])

  if (online === undefined) return null

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
      disabled={online === 'online'}
    >
      <Text color={textColor} variant="regular" fontSize={14}>
        {title}
      </Text>
    </TouchableOpacityBox>
  )
}

export default StatusBadge
