import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Position } from 'geojson'
import Search from '@assets/images/search.svg'
import { Platform } from 'react-native'
import { Hotspot, Witness } from '@helium/http'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Map from '../../../components/Map'
import Button from '../../../components/Button'
import ImageBox from '../../../components/ImageBox'
import { reverseGeocode } from '../../../utils/location'
import { useSpacing } from '../../../theme/themeHooks'
import animateTransition from '../../../utils/animateTransition'
import sleep from '../../../utils/sleep'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { getH3Location } from '../../../utils/h3Utils'
import useAlert from '../../../utils/useAlert'

type Props = {
  confirming?: boolean
  amount: string
  coords?: { latitude: number; longitude: number }
  locationSelected?: (latitude: number, longitude: number, name: string) => void
  onCancel: () => void
  onConfirm: () => void
  onSearch?: () => void
  hotspot?: Hotspot | Witness
}
const ReassertLocationUpdate = ({
  confirming,
  hotspot,
  coords,
  amount,
  locationSelected,
  onConfirm,
  onCancel,
  onSearch,
}: Props) => {
  const { t } = useTranslation()
  const [markerCenter, setMarkerCenter] = useState([0, 0])
  const [locationName, setLocationName] = useState('')
  const { l } = useSpacing()
  const [disabled, setDisabled] = useState(true)
  const { showOKAlert } = useAlert()

  const onMapMoved = useCallback(async (newCoords?: Position) => {
    if (newCoords) {
      setMarkerCenter(newCoords)

      const [longitude, latitude] = newCoords
      const results = await reverseGeocode(latitude, longitude)
      if (!results.length) return
      const [{ street, city }] = results
      const name = street && city ? [street, city].join(', ') : 'Loading...'
      setLocationName(name)
    }
  }, [])

  const handleNextButton = () => {
    if (!confirming) {
      const h3Location = getH3Location(markerCenter[1], markerCenter[0])
      if (h3Location === hotspot?.location) {
        showOKAlert({
          titleKey:
            'hotspot_setup.add_hotspot.assert_loc_error_no_change_title',
          messageKey:
            'hotspot_setup.add_hotspot.assert_loc_error_no_change_body',
        })
        return
      }
      locationSelected?.(markerCenter[1], markerCenter[0], locationName)
    } else {
      onConfirm()
    }
  }

  const handleSearchPress = useCallback(() => {
    onSearch?.()
  }, [onSearch])

  useEffect(() => {
    const sleepThenEnable = async () => {
      await sleep(3000)
      animateTransition('ReassertLocationUpdate')
      setDisabled(false)
    }
    sleepThenEnable()
  }, [])

  return (
    <Box
      height={
        Platform.OS === 'ios'
          ? { smallPhone: 550, phone: 750 }
          : { smallPhone: 450, phone: 650 }
      }
      borderRadius="l"
      overflow="hidden"
    >
      <Box
        position="absolute"
        flexDirection="row"
        justifyContent="space-between"
        zIndex={10000}
        top={0}
        left={0}
        right={0}
      >
        <Text
          variant="bold"
          fontSize={15}
          color="white"
          padding="l"
          textAlign="center"
        >
          {locationName}
        </Text>
        <TouchableOpacityBox onPress={handleSearchPress} padding="lm">
          <Search width={30} height={30} color="white" />
        </TouchableOpacityBox>
      </Box>

      <Map
        showUserLocation={!confirming && !coords}
        mapCenter={coords ? [coords.longitude, coords.latitude] : undefined}
        zoomLevel={16}
        onMapMoved={onMapMoved}
        interactive={!confirming}
        showH3Grid
        showNearbyHotspots
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
            height={56}
            variant="destructive"
            mode="contained"
            title={t('generic.cancel')}
            marginRight="s"
            onPress={onCancel}
          />
          <Button
            disabled={disabled}
            color={confirming ? 'black' : undefined}
            height={56}
            flex={198}
            variant={confirming ? 'secondary' : 'primary'}
            mode="contained"
            onPress={handleNextButton}
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
