import React, { memo, useMemo } from 'react'
import { ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import animalName from 'angry-purple-tiger'
import Balance, { DataCredits, USDollars } from '@helium/currency'
import { Hotspot, Witness } from '@helium/http'
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
  hotspot: Hotspot | Witness
  // Parents can optionally pass a new location directly to ReassertLocationFee which will show
  // the new location and expose a direct "Confirmation" state, rather than showing the hotspot's
  // current location and the ability to find a new location.
  newLocation?: { latitude: number; longitude: number; name?: string }
  // If rendering the "Confirmation" state mentioned above, a secondary "cancel" CTA is displayed
  // alongside the "I Confirm" primary CTA, triggering this callback
  onCancel?: () => void
  // Parents can pass "isLoading" to indicate whether they're processing an async action, which
  // will be manifested by a loading indicator inside the primary confirmation CTA
  isLoading?: boolean
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
  newLocation,
  onCancel,
  isLoading,
}: Props) => {
  const { t } = useTranslation()

  const disableButton = useMemo(
    () => (isFree ? false : !hasSufficientBalance),
    [hasSufficientBalance, isFree],
  )

  const mapCenter = useMemo(() => {
    if (newLocation) return [newLocation.longitude, newLocation.latitude]
    return hotspot.lng !== undefined && hotspot.lat !== undefined
      ? [hotspot.lng, hotspot.lat]
      : undefined
  }, [newLocation, hotspot.lng, hotspot.lat])

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
            {newLocation
              ? t('hotspot_settings.reassert.new_location')
              : t('hotspot_settings.reassert.current_location')}
          </Text>
          {newLocation ? (
            <HotspotLocationPreview
              mapCenter={mapCenter}
              locationName={newLocation.name}
            />
          ) : (
            <HotspotLocationPreview
              mapCenter={mapCenter}
              geocode={hotspot.geocode}
            />
          )}
        </>
      )}
      {newLocation ? (
        <Box flexDirection="row" marginTop="m">
          <Button
            flex={132}
            height={56}
            variant="destructive"
            mode="contained"
            title={t('generic.cancel')}
            marginRight="s"
            onPress={onCancel}
          />
          <Button
            disabled={false}
            color="black"
            height={56}
            flex={198}
            variant="secondary"
            mode="contained"
            onPress={onChangeLocation}
            title={
              isLoading ? undefined : t('hotspot_settings.reassert.confirm')
            }
            icon={isLoading ? <ActivityIndicator color="white" /> : undefined}
          />
        </Box>
      ) : (
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
      )}
    </Box>
  )
}

export default memo(ReassertLocationFee)
