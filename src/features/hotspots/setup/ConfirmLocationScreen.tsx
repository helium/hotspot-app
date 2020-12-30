import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import ImageBox from '../../../components/ImageBox'
import Map from '../../../components/Map'
import Text from '../../../components/Text'
import { reverseGeocode } from '../../../utils/location'
import sleep from '../../../utils/sleep'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'

const ConfirmLocationScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const [disabled, setDisabled] = useState(true)
  const [mapCenter, setMapCenter] = useState([122.419, 37.775])
  const [markerCenter, setMarkerCenter] = useState([0, 0])
  const [mapMoving, setMapMoving] = useState(false)
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

  const onMapMoved = async (newCoords: number[]) => {
    setMarkerCenter(newCoords)
    setMapMoving(false)

    const [longitude, latitude] = newCoords
    const [{ street, city }] = await reverseGeocode(latitude, longitude)
    const name = street && city ? [street, city].join(', ') : 'Loading...'
    setLocationName(name)

    // TODO: What is this here for?
    // if (moment().diff(this.state.didMountAt, 'seconds') >= 3) {
    //   this.setState({
    //     disabled: false,
    //   })
    // }
  }

  const navNext = () => {
    console.log(`Pin location: ${markerCenter}`)

    // TODO: Assert Location

    navigation.push('HotspotTxnsProgressScreen')
  }

  const onMapMoving = () => setMapMoving(true)

  const onDidFinishLoadingMap = (latitude: number, longitude: number) => {
    setZoomLevel(16)
    setHasGPSLocation(true)
    setMapCenter([longitude, latitude])
  }

  return (
    <BackScreen>
      <Box flex={1.2}>
        <Map
          mapCenter={mapCenter}
          onMapMoved={onMapMoved}
          onMapMoving={onMapMoving}
          onDidFinishLoadingMap={onDidFinishLoadingMap}
          zoomLevel={zoomLevel}
          currentLocationEnabled
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          style={{ marginTop: -60, marginLeft: -11 }}
          width={22}
          height={66}
          justifyContent="flex-end"
          alignItems="center"
        >
          {mapMoving && (
            <ImageBox
              source={require('../../../assets/images/map-pin-up.png')}
              width={22}
              height={66}
            />
          )}
          {!mapMoving && (
            <ImageBox
              source={require('../../../assets/images/map-pin.png')}
              width={22}
              height={52}
            />
          )}
        </Box>
      </Box>
      <Box flex={1}>
        <Text variant="body1Mono" textAlign="center" marginTop="m">
          {hasGPSLocation ? locationName : t('hotspot_setup.location.finding')}
        </Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          variant="h1"
          textAlign="center"
          marginTop="m"
        >
          {t('hotspot_setup.location.title')}
        </Text>
        <Text variant="body1Light" textAlign="center" marginTop="m">
          {t('hotspot_setup.location.subtitle')}
        </Text>
        <Box flex={1} justifyContent="flex-end">
          <Button
            onPress={navNext}
            variant="primary"
            mode="contained"
            disabled={disabled}
            title={t('hotspot_setup.location.next')}
          />
        </Box>
      </Box>
    </BackScreen>
  )
}

export default ConfirmLocationScreen
