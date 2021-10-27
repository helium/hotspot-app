import React, { memo } from 'react'
import Box from '../../../../components/Box'
import Map from '../../../../components/Map'
import ImageBox from '../../../../components/ImageBox'
import Text from '../../../../components/Text'

type Geocode = {
  shortStreet?: string
  shortState?: string
  shortCountry?: string
  shortCity?: string
  longStreet?: string
  longStat?: string
  longCountry?: string
  longCity?: string
}
type Props = {
  mapCenter: number[]
  geocode?: Geocode
  locationName?: string
}
const HotspotLocationPreview = ({
  mapCenter,
  geocode,
  locationName,
}: Props) => {
  return (
    <Box borderRadius="l" overflow="hidden" height={180}>
      <Map
        zoomLevel={13}
        interactive={false}
        mapCenter={mapCenter}
        cameraBottomOffset={55}
      />
      <ImageBox
        position="absolute"
        top="50%"
        left="50%"
        style={{ marginTop: -40, marginLeft: -25 / 2 }}
        width={25}
        height={29}
        source={require('../../../../assets/images/locationWhite.png')}
      />
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding="m"
        backgroundColor="purpleDull"
      >
        <Text variant="bold" fontSize={15} numberOfLines={1}>
          {locationName ||
            `${geocode?.longStreet}, ${geocode?.shortCity}, ${geocode?.shortCountry}`}
        </Text>
      </Box>
    </Box>
  )
}

export default memo(HotspotLocationPreview)
