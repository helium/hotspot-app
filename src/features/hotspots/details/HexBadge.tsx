import React, { useCallback, useMemo } from 'react'
import { Alert, Linking, Insets } from 'react-native'
import Hex from '@assets/images/hex.svg'
import { useTranslation } from 'react-i18next'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { decimalSeparator, locale } from '../../../utils/i18n'
import { useColors } from '../../../theme/themeHooks'
import { generateRewardScaleColor } from '../../../utils/hotspotUtils'
import Articles from '../../../constants/articles'
import { Colors } from '../../../theme/theme'

type Props = {
  hotspotId?: string
  rewardScale?: number
  pressable?: boolean
  badge?: boolean
  backgroundColor?: Colors
  fontSize?: number
  hitSlop?: Insets
}
const HexBadge = ({
  hotspotId,
  rewardScale,
  pressable = true,
  backgroundColor,
  badge = true,
  fontSize = 13,
  hitSlop,
}: Props) => {
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
            const url = `https://app.hotspotty.net/hotspots/${hotspotId}/reward-scaling`
            if (Linking.canOpenURL(url))
              Linking.openURL(url)
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
      backgroundColor={backgroundColor}
      borderRadius={badge ? 'l' : undefined}
      flexDirection="row"
      hitSlop={hitSlop}
      justifyContent="center"
      alignItems="center"
      width={badge ? 59 : undefined}
      marginLeft={badge ? 'xs' : undefined}
      disabled={!pressable}
    >
      <Hex color={colors[color]} width={14} />
      <Text
        color="grayText"
        variant="regular"
        fontSize={fontSize}
        marginLeft="xs"
      >
        {scaleString}
      </Text>
    </TouchableOpacityBox>
  )
}

export default HexBadge
