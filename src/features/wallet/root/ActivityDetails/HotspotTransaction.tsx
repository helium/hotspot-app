import React, { useEffect, useState } from 'react'
import {
  AddGatewayV1,
  AnyTransaction,
  AssertLocationV1,
  PendingTransaction,
  TransferHotspotV1,
} from '@helium/http'
import animalName from 'angry-purple-tiger'
import { LocationGeocodedAddress } from 'expo-location'
import LittleHotspot from '@assets/images/littleHotspot.svg'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import PaymentItem from './PaymentItem'
import { reverseGeocode } from '../../../../utils/location'

const isAssert = (
  arg: AnyTransaction | PendingTransaction,
): arg is AssertLocationV1 => 'lat' in arg
const isGateway = (
  arg: AnyTransaction | PendingTransaction,
): arg is AddGatewayV1 => 'gateway' in arg
const isTransfer = (
  arg: AnyTransaction | PendingTransaction,
): arg is TransferHotspotV1 => 'seller' in arg

type Props = { item: AnyTransaction | PendingTransaction; address: string }
const HotspotTransaction = ({ item, address }: Props) => {
  const [geoInfo, setGeoInfo] = useState<LocationGeocodedAddress | undefined>()

  let assertLoc: AssertLocationV1 | null = null
  if (isAssert(item)) {
    assertLoc = item as AssertLocationV1
  } else if ('txn' in item && isAssert(item.txn)) {
    assertLoc = item.txn
  }

  let addGateway: AddGatewayV1 | null = null
  if (isGateway(item)) {
    addGateway = item as AddGatewayV1
  } else if ('txn' in item && isGateway(item.txn)) {
    addGateway = item.txn
  }

  let transferHotspot: TransferHotspotV1 | null = null
  if (isTransfer(item)) {
    transferHotspot = item as TransferHotspotV1
  } else if ('txn' in item && isTransfer(item.txn)) {
    transferHotspot = item.txn
  }

  const type = item.type as
    | 'assert_location_v1'
    | 'add_gateway_v1'
    | 'transfer_hotspot_v1'

  useEffect(() => {
    const geoCode = async (lat: number, lng: number) => {
      const geo = await reverseGeocode(lat, lng)
      if (!geo.length) return
      setGeoInfo(geo[0])
    }

    if (assertLoc?.lat && assertLoc?.lng) {
      geoCode(assertLoc.lat, assertLoc.lng)
    }
  }, [assertLoc?.lat, assertLoc?.lng])

  if (
    type !== 'add_gateway_v1' &&
    type !== 'assert_location_v1' &&
    type !== 'transfer_hotspot_v1'
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

      {type === 'assert_location_v1' && (
        <PaymentItem
          isFirst
          isLast
          text={
            geoInfo
              ? `${geoInfo?.city}, ${geoInfo?.region}`
              : assertLoc?.location || ''
          }
          subText={geoInfo?.country}
          mode="location"
        />
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
            isLast
            text={transferHotspot?.seller || ''}
            isMyAccount={transferHotspot?.seller === address}
            mode="seller"
          />
          <PaymentItem
            isFirst
            isLast
            text={transferHotspot?.buyer || ''}
            isMyAccount={transferHotspot?.buyer === address}
            mode="buyer"
          />
        </>
      )}
    </Box>
  )
}

export default HotspotTransaction
