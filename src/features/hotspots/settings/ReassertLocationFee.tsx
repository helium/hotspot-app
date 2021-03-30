import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import animalName from 'angry-purple-tiger'
import Balance, { DataCredits, USDollars } from '@helium/currency'
import { Hotspot } from '@helium/http'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import TextTransform from '../../../components/TextTransform'
import Map from '../../../components/Map'
import Button from '../../../components/Button'
import Check from '../../../assets/images/check.svg'
import PartialSuccess from '../../../assets/images/partialSuccess.svg'
import ImageBox from '../../../components/ImageBox'

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
          <Text variant="body1Medium" color="black" marginTop="m">
            Current Location
          </Text>
          <Box marginTop="s" borderRadius="l" overflow="hidden" height={160}>
            <Map zoomLevel={13} interactive={false} mapCenter={mapCenter} />
            <ImageBox
              position="absolute"
              top="50%"
              left="50%"
              style={{ marginTop: -45, marginLeft: -25 / 2 }}
              width={25}
              height={29}
              source={require('../../../assets/images/locationWhite.png')}
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              padding="m"
              backgroundColor="purpleDull"
            >
              <Text variant="bold" fontSize={15} numberOfLines={1}>
                {`${hotspot.geocode?.longStreet}, ${hotspot.geocode?.shortCity}, ${hotspot.geocode?.shortCountry}`}
              </Text>
            </Box>
          </Box>
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
