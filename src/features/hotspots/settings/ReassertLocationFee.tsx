import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import animalName from 'angry-purple-tiger'
import { LocationGeocodedAddress } from 'expo-location'
import { useSelector } from 'react-redux'
import Balance, { DataCredits, USDollars } from '@helium/currency'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import TextTransform from '../../../components/TextTransform'
import Map from '../../../components/Map'
import Button from '../../../components/Button'
import Check from '../../../assets/images/check.svg'
import PartialSuccess from '../../../assets/images/partialSuccess.svg'
import { RootState } from '../../../store/rootReducer'

type Props = {
  locationAddress?: LocationGeocodedAddress
  onChangeLocation?: () => void
  remainingFreeAsserts: number
  isFree: boolean
  hasSufficientBalance: boolean
  totalStakingAmountDC: Balance<DataCredits>
  totalStakingAmountUsd: Balance<USDollars>
  isPending?: boolean
}

const ReassertLocationFee = ({
  locationAddress,
  onChangeLocation,
  remainingFreeAsserts,
  hasSufficientBalance,
  isFree,
  totalStakingAmountDC,
  totalStakingAmountUsd,
  isPending,
}: Props) => {
  const { t } = useTranslation()

  const {
    connectedHotspot: { address: hotspotAddress },
  } = useSelector((state: RootState) => state)

  return (
    <Box height={569} padding="l" paddingTop="lx">
      <Text variant="medium" fontSize={21} color="black" marginBottom="l">
        {hotspotAddress ? animalName(hotspotAddress) : ''}
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
            marginTop="m"
            padding="m"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="m"
            backgroundColor="grayBox"
            flexDirection="row"
          >
            <Text variant="body1" numberOfLines={1} color="black">
              {`${totalStakingAmountDC.toString()} (~$${totalStakingAmountUsd.toString()})`}
            </Text>
            {hasSufficientBalance && <Check height={18} width={18} />}
            {!hasSufficientBalance && <PartialSuccess height={18} width={18} />}
          </Box>
          {!hasSufficientBalance && (
            <Text
              variant="body2"
              color="grayText"
              marginTop="m"
              textAlign="center"
            >
              {t('hotspot_settings.reassert.insufficient_funds')}
            </Text>
          )}
        </>
      )}
      <Box flex={1} marginTop="m" borderRadius="l" overflow="hidden">
        <Map showUserLocation zoomLevel={13} interactive={false} />
        {locationAddress && (
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            padding="m"
            backgroundColor="purpleDull"
          >
            <Text variant="bold" fontSize={15} numberOfLines={1}>
              {`${locationAddress.street}, ${locationAddress.city} ${locationAddress.isoCountryCode}`}
            </Text>
          </Box>
        )}
      </Box>
      <Button
        disabled={!hasSufficientBalance || isPending}
        onPress={onChangeLocation}
        marginTop="lx"
        marginBottom="s"
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
