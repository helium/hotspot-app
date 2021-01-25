import React, { useEffect, useState } from 'react'
import {
  AnyTransaction,
  PendingTransaction,
  AddGatewayV1,
  AssertLocationV1,
  TransferHotspotV1,
} from '@helium/http'
import animalName from 'angry-purple-tiger'
import { LocationGeocodedAddress } from 'expo-location'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import PaymentItem from './PaymentItem'
import LittleHotspot from '../../../../assets/images/littleHotspot.svg'
import { reverseGeocode } from '../../../../utils/location'

type Props = { item: AnyTransaction | PendingTransaction; address: string }
const HotspotTransaction = ({ item, address }: Props) => {
  const [geoInfo, setGeoInfo] = useState<LocationGeocodedAddress | undefined>()
  const addGateway = (item as unknown) as AddGatewayV1
  const assertLoc = (item as unknown) as AssertLocationV1
  const transferHotspot = (item as unknown) as TransferHotspotV1

  const type = item.type as
    | 'assert_location_v1'
    | 'add_gateway_v1'
    | 'transfer_hotspot_v1'

  useEffect(() => {
    const geoCode = async () => {
      const geo = await reverseGeocode(assertLoc.lat, assertLoc.lng)
      if (!geo.length) return
      setGeoInfo(geo[0])
    }

    if (assertLoc.lat && assertLoc.lng) {
      geoCode()
    }
  }, [assertLoc.lat, assertLoc.lng])

  if (
    type !== 'add_gateway_v1' &&
    type !== 'assert_location_v1' &&
    type !== 'transfer_hotspot_v1'
  )
    return null

  return (
    <Box flex={1} marginTop="s" marginBottom="xxl">
      {type !== 'transfer_hotspot_v1' && (
        <Text
          variant="light"
          fontSize={15}
          color="blueBright"
          alignSelf="flex-end"
        >
          {addGateway.fee && `-${addGateway.fee.toString()}`}
        </Text>
      )}
      <Box
        flexDirection="row"
        alignItems="center"
        marginBottom="m"
        marginTop="m"
      >
        <LittleHotspot />
        <Text variant="medium" fontSize={15} color="black" marginLeft="s">
          {animalName(addGateway.gateway)}
        </Text>
      </Box>

      {type === 'assert_location_v1' && (
        <PaymentItem
          isFirst
          isLast
          text={`${geoInfo?.city}, ${geoInfo?.region}`}
          subText={geoInfo?.country}
          mode="location"
        />
      )}

      {type === 'add_gateway_v1' && (
        <PaymentItem
          isFirst
          isLast
          text={addGateway.owner}
          isMyAccount={addGateway.owner === address}
          mode="owner"
        />
      )}

      {type === 'transfer_hotspot_v1' && (
        <>
          <PaymentItem
            isFirst
            isLast
            text={transferHotspot.seller}
            isMyAccount={transferHotspot.seller === address}
            mode="seller"
          />
          <PaymentItem
            isFirst
            isLast
            text={transferHotspot.buyer}
            isMyAccount={transferHotspot.buyer === address}
            mode="buyer"
          />
        </>
      )}
    </Box>
  )
}

export default HotspotTransaction
