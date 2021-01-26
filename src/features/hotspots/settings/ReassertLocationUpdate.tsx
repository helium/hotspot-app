import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Position } from 'geojson'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Map from '../../../components/Map'
import Button from '../../../components/Button'
import { hp } from '../../../utils/layout'
import ImageBox from '../../../components/ImageBox'
import { reverseGeocode } from '../../../utils/location'
import { useSpacing } from '../../../theme/themeHooks'

type Props = {
  confirming?: boolean
  locationSelected: (latitude: number, longitude: number) => void
}
const ReassertLocationUpdate = ({ confirming, locationSelected }: Props) => {
  const { t } = useTranslation()
  const [markerCenter, setMarkerCenter] = useState([0, 0])
  const [locationName, setLocationName] = useState('')
  const { l } = useSpacing()

  const onMapMoved = async (newCoords?: Position) => {
    if (newCoords) {
      setMarkerCenter(newCoords)

      const [longitude, latitude] = newCoords
      const [{ street, city }] = await reverseGeocode(latitude, longitude)
      const name = street && city ? [street, city].join(', ') : 'Loading...'
      setLocationName(name)
    }
  }

  return (
    <Box height={hp(80)} borderRadius="l" overflow="hidden">
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

      {/* TODO: Figure out how to reset the map back to the users original location when confirming */}
      <Map
        showUserLocation
        mapCenter={[0, 0]}
        zoomLevel={16}
        onMapMoved={onMapMoved}
      />
      <ImageBox
        position="absolute"
        top="50%"
        left="50%"
        marginTop="n_l"
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
          >
            {/* TODO: Localize */}
            <Text variant="medium" fontSize={15} color="black">
              Please confirm your Hotspot’s change in location.
            </Text>
            {/* TODO: Localize and put in right value (free or otherwise) */}
            <Text variant="light" fontSize={15} color="black">
              You will be charged 100,000 DC.
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
            flex={198}
            variant={confirming ? 'secondary' : 'primary'}
            mode="contained"
            onPress={() => locationSelected(markerCenter[1], markerCenter[0])}
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
