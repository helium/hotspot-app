import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import animalName from 'angry-purple-tiger'
import { useAsync } from 'react-async-hook'
import { LocationGeocodedAddress } from 'expo-location'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { getSecureItem } from '../../../utils/secureAccount'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import TextTransform from '../../../components/TextTransform'
import Map from '../../../components/Map'
import Button from '../../../components/Button'

type Props = { locationAddress?: LocationGeocodedAddress }
const ReassertLocationFee = ({ locationAddress }: Props) => {
  const { t } = useTranslation()
  const { loadLocationFeeData } = useConnectedHotspotContext()
  const { result: feeData } = useAsync(loadLocationFeeData, [])
  const { result: address } = useAsync(getSecureItem, ['address'])

  return (
    <Box height={569} padding="l" paddingTop="lx">
      <Text variant="medium" fontSize={21} color="black">
        {address ? animalName(address) : ''}
      </Text>
      {feeData && feeData.remainingAsserts > 0 && (
        <TextTransform
          i18nKey="hotspot_settings.reassert.remaining"
          values={{ count: feeData.remainingAsserts }}
          variant="regular"
          fontSize={16}
          color="black"
        />
      )}
      <Box flex={1} marginTop="m" borderRadius="l" overflow="hidden">
        <Map showUserLocation zoomLevel={13} />
        {locationAddress && (
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            padding="m"
            backgroundColor="purpleDull"
          >
            <Text
              variant="bold"
              fontSize={15}
              numberOfLines={1}
            >{`${locationAddress.street}, ${locationAddress.city} ${locationAddress.isoCountryCode}`}</Text>
          </Box>
        )}
      </Box>
      <Button
        marginTop="lx"
        marginBottom="s"
        variant="primary"
        mode="contained"
        title={t('hotspot_settings.reassert.change_location')}
      />
    </Box>
  )
}

export default memo(ReassertLocationFee)
