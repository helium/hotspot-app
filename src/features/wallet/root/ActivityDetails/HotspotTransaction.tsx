import React, { useEffect, useState } from 'react'
import animalName from 'angry-purple-tiger'
import { LocationGeocodedAddress } from 'expo-location'
import LittleHotspot from '@assets/images/littleHotspot.svg'
import { useTranslation } from 'react-i18next'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import PaymentItem from './PaymentItem'
import { reverseGeocode } from '../../../../utils/location'
import { getGeoFromH3 } from '../../../../utils/h3Utils'
import { locale } from '../../../../utils/i18n'
import { HttpTransaction } from '../../../../store/activity/activitySlice'

type Props = { item: HttpTransaction; address: string }
const HotspotTransaction = ({ item, address }: Props) => {
  const { t } = useTranslation()
  const [geoInfo, setGeoInfo] = useState<LocationGeocodedAddress | undefined>()

  const type = item.type as
    | 'assert_location_v1'
    | 'assert_location_v2'
    | 'add_gateway_v1'
    | 'transfer_hotspot_v1'
    | 'transfer_hotspot_v2'

  useEffect(() => {
    const geoCode = async (lat: number, lng: number) => {
      const geo = await reverseGeocode(lat, lng)
      if (!geo.length) return
      setGeoInfo(geo[0])
    }

    if (item.lat && item.lng) {
      geoCode(item.lat, item.lng)
    } else if (item.location) {
      const geo = getGeoFromH3(item.location)
      geoCode(geo[0], geo[1])
    }
  }, [item])

  if (
    type !== 'add_gateway_v1' &&
    type !== 'assert_location_v1' &&
    type !== 'assert_location_v2' &&
    type !== 'transfer_hotspot_v1' &&
    type !== 'transfer_hotspot_v2'
  )
    return null

  return (
    <Box flex={1} marginBottom="xl">
      <Box flexDirection="row" alignItems="center" marginBottom="m">
        <LittleHotspot />
        <Text variant="medium" fontSize={15} color="black" marginLeft="s">
          {item?.gateway ? animalName(item.gateway) : 'Hotspot'}
        </Text>
      </Box>

      {(type === 'assert_location_v1' || type === 'assert_location_v2') && (
        <PaymentItem
          isFirst
          isLast={type === 'assert_location_v1'}
          text={
            geoInfo && geoInfo.city && geoInfo.region
              ? `${geoInfo.city}, ${geoInfo.region}`
              : item.location || ' '
          }
          subText={geoInfo && geoInfo.country ? geoInfo.country : ' '}
          mode="location"
        />
      )}

      {type === 'assert_location_v2' && (
        <>
          <PaymentItem
            isFirst={false}
            text={t('hotspot_setup.location_fee.gain', {
              gain: ((item.gain || 0) / 10).toLocaleString(locale, {
                maximumFractionDigits: 1,
              }),
            })}
            mode="antenna"
          />
          <PaymentItem
            isFirst={false}
            isLast
            text={t('hotspot_setup.location_fee.elevation', {
              count: item.elevation || 0,
            })}
            mode="elevation"
          />
        </>
      )}

      {type === 'add_gateway_v1' && (
        <PaymentItem
          isFirst
          isLast
          text={item.owner || ''}
          isMyAccount={item.owner === address}
          mode="owner"
        />
      )}

      {type === 'transfer_hotspot_v1' && (
        <>
          <PaymentItem
            isFirst
            text={item.seller || ''}
            isMyAccount={item.seller === address}
            mode="seller"
          />
          <PaymentItem
            isLast
            text={item.buyer || ''}
            isMyAccount={item.buyer === address}
            mode="buyer"
          />
        </>
      )}

      {type === 'transfer_hotspot_v2' && (
        <>
          <PaymentItem
            isFirst
            text={item?.owner || ''}
            isMyAccount={item?.owner === address}
            mode="seller"
          />
          <PaymentItem
            isLast
            text={item?.newOwner || ''}
            isMyAccount={item?.newOwner === address}
            mode="buyer"
          />
        </>
      )}
    </Box>
  )
}

export default HotspotTransaction
