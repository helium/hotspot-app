import React, { useCallback, useMemo } from 'react'
import { Alert, Linking } from 'react-native'
import Hex from '@assets/images/hex.svg'
import { useTranslation } from 'react-i18next'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { decimalSeparator, locale } from '../../../utils/i18n'
import { useColors } from '../../../theme/themeHooks'
import { generateRewardScaleColor } from '../../../utils/hotspotUtils'
import Articles from '../../../constants/articles'

type Props = {
  rewardScale?: number
}
const HexBadge = ({ rewardScale }: Props) => {
  const colors = useColors()
  const { t } = useTranslation()
  const handlePress = useCallback(() => {
    Alert.alert(
      t('hotspot_details.reward_scale_prompt.title'),
      t('hotspot_details.reward_scale_prompt.message'),
      [
        {
          text: t('generic.ok'),
        },
        {
          text: t('generic.readMore'),
          style: 'cancel',
          onPress: () => {
            if (Linking.canOpenURL(Articles.Reward_Scaling))
              Linking.openURL(Articles.Reward_Scaling)
          },
        },
      ],
    )
  }, [t])

  const color = useMemo(() => {
    if (!rewardScale) return 'white'

    return generateRewardScaleColor(rewardScale)
  }, [rewardScale])

  const scaleString = useMemo(() => {
    if (!rewardScale) return ''

    if (rewardScale === 1) return `1${decimalSeparator}00`

    return rewardScale.toLocaleString(locale, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
  }, [rewardScale])

  if (!rewardScale) return null
  return (
    <TouchableOpacityBox
      onPress={handlePress}
      backgroundColor="grayBox"
      borderRadius="ms"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      width={59}
      marginLeft="xs"
    >
      <Hex color={colors[color]} width={14} />
      <Text color="grayText" variant="regular" fontSize={13} marginLeft="xs">
        {scaleString}
      </Text>
    </TouchableOpacityBox>
  )
}

export default HexBadge
