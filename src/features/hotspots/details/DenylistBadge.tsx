import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { useSelector } from 'react-redux'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { RootState } from '../../../store/rootReducer'
import Articles from '../../../constants/articles'

type Props = {
  hotspotAddress: string
}

const DenylistBadge = ({ hotspotAddress }: Props) => {
  const { t } = useTranslation()
  const denylists =
    useSelector(
      (state: RootState) => state.hotspotDetails.denylists[hotspotAddress],
    ) || []

  const onDenylist = useMemo(() => denylists?.data?.length > 0, [
    denylists?.data,
  ])

  const onPress = useCallback(() => Linking.openURL(Articles.Denylist), [])

  if (!onDenylist) return null

  return (
    <TouchableOpacityBox
      backgroundColor="redMedium"
      paddingHorizontal="s"
      paddingVertical="xxs"
      hitSlop={{ top: 24, bottom: 24 }}
      borderRadius="l"
      alignItems="center"
      justifyContent="center"
      onPress={onPress}
      minWidth={60}
    >
      <Text color="white" variant="regular" fontSize={14}>
        {t('hotspot_details.denylist')}
      </Text>
    </TouchableOpacityBox>
  )
}

export default memo(DenylistBadge)
