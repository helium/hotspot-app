import React, { useEffect, useState } from 'react'
import {
  AddGatewayV1,
  AnyTransaction,
  AssertLocationV1,
  AssertLocationV2,
  PendingTransaction,
  TransferHotspotV1,
  TransferHotspotV2,
} from '@helium/http'
import animalName from 'angry-purple-tiger'
import { LocationGeocodedAddress } from 'expo-location'
import LittleHotspot from '@assets/images/littleHotspot.svg'
import { useTranslation } from 'react-i18next'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import PaymentItem from './PaymentItem'
import { reverseGeocode } from '../../../../utils/location'
import { getGeoFromH3 } from '../../../../utils/h3Utils'

const isAssertV1 = (
  arg: AnyTransaction | PendingTransaction,
): arg is AssertLocationV1 => 'lat' in arg
const isAssertV2 = (
  arg: AnyTransaction | PendingTransaction,
): arg is AssertLocationV2 => 'gain' in arg
const isGateway = (
  arg: AnyTransaction | PendingTransaction,
): arg is AddGatewayV1 => 'gateway' in arg
const isTransferV1 = (
  arg: AnyTransaction | PendingTransaction,
): arg is TransferHotspotV1 => 'seller' in arg
const isTransferV2 = (
  arg: AnyTransaction | PendingTransaction,
): arg is TransferHotspotV2 => 'newOwner' in arg

type Props = { item: AnyTransaction | PendingTransaction; address: string }
const HotspotTransaction = ({ item, address }: Props) => {
  const { t } = useTranslation()
  const [geoInfo, setGeoInfo] = useState<LocationGeocodedAddress | undefined>()

  let assertLoc: AssertLocationV1 | AssertLocationV2 | null = null
  if (isAssertV1(item)) {
    assertLoc = item as AssertLocationV1
  } else if ('txn' in item && isAssertV1(item.txn)) {
    assertLoc = item.txn as AssertLocationV1
  } else if (isAssertV2(item)) {
    assertLoc = item as AssertLocationV2
  } else if ('txn' in item && isAssertV2(item.txn)) {
    assertLoc = item.txn as AssertLocationV2
  }

  let addGateway: AddGatewayV1 | null = null
  if (isGateway(item)) {
    addGateway = item as AddGatewayV1
  } else if ('txn' in item && isGateway(item.txn)) {
    addGateway = item.txn
  }

  let transferHotspot: TransferHotspotV1 | TransferHotspotV2 | null = null
  if (isTransferV1(item)) {
    transferHotspot = item as TransferHotspotV1
  } else if ('txn' in item && isTransferV1(item.txn)) {
    transferHotspot = item.txn as TransferHotspotV1
  } else if (isTransferV2(item)) {
    transferHotspot = item as TransferHotspotV2
  } else if ('txn' in item && isTransferV2(item.txn)) {
    transferHotspot = item.txn as TransferHotspotV2
  }

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

    if (assertLoc?.lat && assertLoc?.lng) {
      geoCode(assertLoc.lat, assertLoc.lng)
    } else if (assertLoc?.location) {
      const geo = getGeoFromH3(assertLoc.location)
      geoCode(geo[0], geo[1])
    }
  }, [assertLoc?.lat, assertLoc?.lng, assertLoc?.location])

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
      <Box
        flexDirection="row"
        alignItems="center"
        marginBottom="m"
        marginTop="m"
      >
        <LittleHotspot />
        <Text variant="medium" fontSize={15} color="black" marginLeft="s">
          {addGateway?.gateway ? animalName(addGateway.gateway) : 'Hotspot'}
        </Text>
      </Box>

      {(type === 'assert_location_v1' || type === 'assert_location_v2') && (
        <PaymentItem
          isFirst
          isLast={type === 'assert_location_v1'}
          text={
            geoInfo && geoInfo.city && geoInfo.region
              ? `${geoInfo.city}, ${geoInfo.region}`
              : assertLoc?.location || ' '
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
              gain: (assertLoc as AssertLocationV2).gain / 10,
            })}
            mode="antenna"
          />
          <PaymentItem
            isFirst={false}
            isLast
            text={t('hotspot_setup.location_fee.elevation', {
              count: (assertLoc as AssertLocationV2).elevation,
            })}
            mode="elevation"
          />
        </>
      )}

      {type === 'add_gateway_v1' && (
        <PaymentItem
          isFirst
          isLast
          text={addGateway?.owner || ''}
          isMyAccount={addGateway?.owner === address}
          mode="owner"
        />
      )}

      {type === 'transfer_hotspot_v1' && (
        <>
          <PaymentItem
            isFirst
            text={(transferHotspot as TransferHotspotV1)?.seller || ''}
            isMyAccount={
              (transferHotspot as TransferHotspotV1)?.seller === address
            }
            mode="seller"
          />
          <PaymentItem
            isLast
            text={(transferHotspot as TransferHotspotV1)?.buyer || ''}
            isMyAccount={
              (transferHotspot as TransferHotspotV1)?.buyer === address
            }
            mode="buyer"
          />
        </>
      )}

      {type === 'transfer_hotspot_v2' && (
        <>
          <PaymentItem
            isFirst
            text={(transferHotspot as TransferHotspotV2)?.owner || ''}
            isMyAccount={
              (transferHotspot as TransferHotspotV2)?.owner === address
            }
            mode="seller"
          />
          <PaymentItem
            isLast
            text={(transferHotspot as TransferHotspotV2)?.newOwner || ''}
            isMyAccount={
              (transferHotspot as TransferHotspotV2)?.newOwner === address
            }
            mode="buyer"
          />
        </>
      )}
    </Box>
  )
}

export default HotspotTransaction
