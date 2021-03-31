import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import animalName from 'angry-purple-tiger'
import Balance, { DataCredits, USDollars } from '@helium/currency'
import { Hotspot } from '@helium/http'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import TextTransform from '../../../components/TextTransform'
import Button from '../../../components/Button'
import Check from '../../../assets/images/check.svg'
import PartialSuccess from '../../../assets/images/partialSuccess.svg'
import HotspotLocationPreview from './updateHotspot/HotspotLocationPreview'

type Props = {
  onChangeLocation?: () => void
  remainingFreeAsserts: number
  isFree: boolean
  hasSufficientBalance: boolean
  totalStakingAmountDC: Balance<DataCredits>
  totalStakingAmountUsd: Balance<USDollars>
  isPending?: boolean
  hotspot: Hotspot
}

const ReassertLocationFee = ({
  onChangeLocation,
  remainingFreeAsserts,
  hasSufficientBalance,
  isFree,
  totalStakingAmountDC,
  totalStakingAmountUsd,
  isPending,
  hotspot,
}: Props) => {
  const { t } = useTranslation()

  const disableButton = useMemo(
    () => (isFree ? false : !hasSufficientBalance),
    [hasSufficientBalance, isFree],
  )

  const mapCenter = useMemo(() => {
    return hotspot.lng !== undefined && hotspot.lat !== undefined
      ? [hotspot.lng, hotspot.lat]
      : undefined
  }, [hotspot.lng, hotspot.lat])

  return (
    <Box>
      <Text
        variant="medium"
        fontSize={21}
        color="black"
        marginVertical="m"
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {animalName(hotspot.address)}
      </Text>
      {isPending && (
        <Text variant="regular" fontSize={16} color="grayText">
          {t('hotspot_settings.reassert.pending_message')}
        </Text>
      )}
      {remainingFreeAsserts > 0 && !isPending && (
        <TextTransform
          i18nKey="hotspot_settings.reassert.remaining"
          values={{ count: remainingFreeAsserts }}
          variant="regular"
          fontSize={16}
          color="black"
        />
      )}
      {!isFree && totalStakingAmountDC.floatBalance > 0 && !isPending && (
        <>
          <Text variant="body1" numberOfLines={1} color="grayText">
            {t('hotspot_settings.reassert.cost')}
          </Text>

          <Box
            marginTop="s"
            padding="m"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="m"
            backgroundColor="grayBox"
            flexDirection="row"
          >
            <Text variant="body2" numberOfLines={1} color="black">
              {`${totalStakingAmountDC.toString()} (~$${totalStakingAmountUsd.toString()})`}
            </Text>
            {hasSufficientBalance && <Check height={18} width={18} />}
            {!hasSufficientBalance && <PartialSuccess height={18} width={18} />}
          </Box>
          {!hasSufficientBalance && (
            <Text
              variant="body2"
              color="grayText"
              marginTop="s"
              textAlign="center"
            >
              {t('hotspot_settings.reassert.insufficient_funds')}
            </Text>
          )}
        </>
      )}
      {mapCenter !== undefined && (
        <>
          <Text
            variant="body1Medium"
            color="black"
            marginTop="m"
            marginBottom="s"
          >
            {t('hotspot_settings.reassert.current_location')}
          </Text>
          <HotspotLocationPreview
            mapCenter={mapCenter}
            geocode={hotspot.geocode}
          />
        </>
      )}
      <Button
        disabled={disableButton || isPending}
        onPress={onChangeLocation}
        marginTop="m"
        variant="primary"
        mode="contained"
        title={
          isPending
            ? t('hotspot_settings.reassert.assert_pending')
            : t('hotspot_settings.reassert.change_location')
        }
      />
    </Box>
  )
}

export default memo(ReassertLocationFee)
