import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Position } from 'geojson'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Map from '../../../components/Map'
import Button from '../../../components/Button'
import { hp } from '../../../utils/layout'
import ImageBox from '../../../components/ImageBox'
import { reverseGeocode } from '../../../utils/location'
import { useSpacing } from '../../../theme/themeHooks'
import animateTransition from '../../../utils/animateTransition'
import CircleLoader from '../../../components/CircleLoader'
import { RootState } from '../../../store/rootReducer'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import sleep from '../../../utils/sleep'

type Props = {
  confirming?: boolean
  amount: string
  coords?: { latitude: number; longitude: number }
  locationSelected?: (latitude: number, longitude: number) => void
  onSuccess?: () => void
  onFailure?: (err: unknown) => void
}
const ReassertLocationUpdate = ({
  confirming,
  coords,
  amount,
  locationSelected,
  onSuccess,
  onFailure,
}: Props) => {
  const { t } = useTranslation()
  const [markerCenter, setMarkerCenter] = useState([0, 0])
  const [locationName, setLocationName] = useState('')
  const { l } = useSpacing()
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const {
    connectedHotspot: { address: hotspotAddress, details },
  } = useSelector((s: RootState) => s)
  const { assertLocationTxn } = useConnectedHotspotContext()
  const onMapMoved = async (newCoords?: Position) => {
    if (newCoords) {
      setMarkerCenter(newCoords)

      const [longitude, latitude] = newCoords
      const [{ street, city }] = await reverseGeocode(latitude, longitude)
      const name = street && city ? [street, city].join(', ') : 'Loading...'
      setLocationName(name)
    }
  }

  const finish = (success: boolean, message?: unknown) => {
    setLoading(false)
    if (success) {
      onSuccess?.()
    } else {
      onFailure?.(
        message ||
          `There was an error updating location for hotspot ${
            hotspotAddress || ''
          }`,
      )
    }
  }
  const submitOnboardingTxns = async () => {
    const isOnChain = !!details // verify the hotspot exists
    if (!hotspotAddress || !isOnChain || !coords) {
      finish(false)
      return
    }

    // construct and publish assert location
    try {
      const assertLocTxnSuccess = await assertLocationTxn(
        coords.latitude,
        coords.longitude,
      )
      if (!assertLocTxnSuccess) {
        finish(false)
        return
      }
      onSuccess?.()
    } catch (error) {
      onFailure?.(error)
    }
  }

  const handleAssert = () => {
    animateTransition()
    setLoading(true)
    submitOnboardingTxns()
  }

  useEffect(() => {
    const sleepThenEnable = async () => {
      await sleep(3000)
      setDisabled(false)
    }
    sleepThenEnable()
  }, [])

  return (
    <Box height={hp(80)} borderRadius="l" overflow="hidden">
      {loading && (
        <Box
          position="absolute"
          zIndex={20000}
          backgroundColor="black"
          opacity={0.8}
          top={0}
          left={0}
          right={0}
          bottom={0}
          justifyContent="center"
        >
          <CircleLoader height={80} marginBottom="lx" />
        </Box>
      )}

      <Box position="absolute" zIndex={10000} top={0} left={0} right={0}>
        <Text
          variant="bold"
          fontSize={15}
          color="white"
          padding="l"
          textAlign="center"
        >
          {locationName}
        </Text>
      </Box>

      <Map
        showUserLocation={!confirming}
        mapCenter={coords ? [coords.longitude, coords.latitude] : undefined}
        zoomLevel={16}
        onMapMoved={onMapMoved}
        interactive={!confirming}
      />
      <ImageBox
        position="absolute"
        top="50%"
        left="50%"
        style={{ marginTop: -29, marginLeft: -25 / 2 }}
        width={25}
        height={29}
        source={require('../../../assets/images/locationWhite.png')}
      />
      <Box
        position="absolute"
        zIndex={10000}
        bottom={l}
        paddingHorizontal="l"
        left={0}
        right={0}
      >
        {confirming && (
          <Box
            backgroundColor="white"
            height={91}
            borderRadius="m"
            marginBottom="m"
            padding="m"
            justifyContent="space-between"
          >
            <Text variant="medium" fontSize={15} color="black">
              {t('hotspot_settings.reassert.confirm_location')}
            </Text>
            <Text variant="light" fontSize={15} color="black">
              {t('hotspot_settings.reassert.charge', { amount })}
            </Text>
          </Box>
        )}
        <Box flexDirection="row">
          <Button
            flex={132}
            variant="destructive"
            mode="contained"
            title={t('generic.cancel')}
            marginRight="s"
          />
          <Button
            disabled={disabled}
            color={confirming ? 'black' : undefined}
            flex={198}
            variant={confirming ? 'secondary' : 'primary'}
            mode="contained"
            onPress={() => {
              if (!confirming) {
                locationSelected?.(markerCenter[1], markerCenter[0])
              } else {
                handleAssert()
              }
            }}
            title={t(
              `hotspot_settings.reassert.${
                confirming ? 'confirm' : 'change_location'
              }`,
            )}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default memo(ReassertLocationUpdate)
