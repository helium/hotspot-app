import React from 'react'
import { useTranslation } from 'react-i18next'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import ImageBox from '../../../components/ImageBox'
import Button from '../../../components/Button'
import Map from '../../../components/Map'
import Text from '../../../components/Text'

const HotspotSetupConfirmLocationScreen = () => {
  const { t } = useTranslation()

  const hotspotCoords = [-122.43593, 37.76178]
  const locationName = 'Collingwood St, San Francisco'

  return (
    <BackScreen>
      <Box flex={1} justifyContent="center" paddingBottom="xxl">
        <Text variant="h1" marginBottom="l">
          {t('hotspot_setup.location_fee.title')}
        </Text>
        <Text variant="subtitleMedium" color="greenBright" marginBottom="l">
          {t('hotspot_setup.location_fee.subtitle_free')}
        </Text>
        <Text variant="subtitleLight" marginBottom="xl">
          {t('hotspot_setup.location_fee.confirm_location')}
        </Text>
        <Box height={220} borderRadius="l" overflow="hidden">
          <Box flex={1}>
            <Map mapCenter={hotspotCoords} zoomLevel={16} interactive={false} />
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
          <Box padding="m" backgroundColor="purple200">
            <Text variant="body2Medium" numberOfLines={1} adjustsFontSizeToFit>
              {locationName}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box>
        <Button
          title={t('hotspot_setup.location_fee.next')}
          mode="contained"
          variant="secondary"
        />
      </Box>
    </BackScreen>
  )
}

export default HotspotSetupConfirmLocationScreen
