import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Position } from 'geojson'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import ImageBox from '../../../components/ImageBox'
import Map from '../../../components/Map'
import Text from '../../../components/Text'
import { reverseGeocode } from '../../../utils/location'
import sleep from '../../../utils/sleep'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Info from '../../../assets/images/info.svg'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

const HotspotSetupPickLocationScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const [disabled, setDisabled] = useState(true)
  const [mapCenter, setMapCenter] = useState([-122.419, 37.775])
  const [markerCenter, setMarkerCenter] = useState([0, 0])
  const [hasGPSLocation, setHasGPSLocation] = useState(false)
  const [locationName, setLocationName] = useState('')
  const [zoomLevel, setZoomLevel] = useState(2)

  useEffect(() => {
    const sleepThenEnable = async () => {
      await sleep(3000)
      setDisabled(false)
    }
    sleepThenEnable()
  }, [])

  const onMapMoved = async (newCoords?: Position) => {
    if (newCoords) {
      setMarkerCenter(newCoords)

      const [longitude, latitude] = newCoords
      const [{ street, city }] = await reverseGeocode(latitude, longitude)
      const name = street && city ? [street, city].join(', ') : 'Loading...'
      setLocationName(name)
    }
  }

  const navNext = () => {
    navigation.navigate('HotspotSetupConfirmLocationScreen', {
      hotspotCoords: markerCenter,
      locationName,
    })
  }

  const onDidFinishLoadingMap = (latitude: number, longitude: number) => {
    setZoomLevel(16)
    setHasGPSLocation(true)
    setMapCenter([longitude, latitude])
  }

  return (
    <SafeAreaBox
      flex={1}
      edges={['bottom']}
      backgroundColor="primaryBackground"
    >
      <Box flex={1.2}>
        <Map
          mapCenter={mapCenter}
          onMapMoved={onMapMoved}
          onDidFinishLoadingMap={onDidFinishLoadingMap}
          zoomLevel={zoomLevel}
          currentLocationEnabled
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          style={{ marginTop: -29, marginLeft: -25 / 2 }}
          width={25}
          height={29}
          justifyContent="flex-end"
          alignItems="center"
        >
          <ImageBox
            source={require('../../../assets/images/map-pin.png')}
            width={25}
            height={29}
          />
        </Box>
      </Box>
      <Box backgroundColor="primaryBackground" padding="l">
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="lm"
        >
          <Box>
            <Text variant="body1" marginBottom="xs">
              {t('hotspot_setup.location.title')}
            </Text>
            <Text variant="body1Bold">{locationName}</Text>
          </Box>
          <TouchableOpacityBox>
            <Info />
          </TouchableOpacityBox>
        </Box>
        <Button
          onPress={navNext}
          variant="primary"
          mode="contained"
          disabled={disabled || !hasGPSLocation}
          title={t('hotspot_setup.location.next')}
        />
      </Box>
    </SafeAreaBox>
  )
}

export default HotspotSetupPickLocationScreen
