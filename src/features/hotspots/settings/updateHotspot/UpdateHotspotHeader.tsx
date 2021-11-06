import React from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../../components/Box'
import DiscoveryIcon from '../../../../assets/images/discovery_mode_icon.svg'
import LocationIcon from '../../../../assets/images/location-icon.svg'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import CloseModal from '../../../../assets/images/closeModal.svg'
import Text from '../../../../components/Text'
import { useColors } from '../../../../theme/themeHooks'

type Props = {
  onClose: () => void
  isLocationChange: boolean
}
const UpdateHotspotHeader = ({ onClose, isLocationChange }: Props) => {
  const colors = useColors()
  const { t } = useTranslation()
  return (
    <Box
      backgroundColor="purpleMain"
      borderTopRightRadius="l"
      borderTopLeftRadius="l"
      padding="l"
    >
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {isLocationChange ? (
          <LocationIcon color="white" />
        ) : (
          <DiscoveryIcon color="white" width={35} height={25} />
        )}
        <TouchableOpacityBox onPress={onClose}>
          <CloseModal color={colors.blackTransparent} />
        </TouchableOpacityBox>
      </Box>
      <Text variant="h2" paddingTop="m" maxFontSizeMultiplier={1}>
        {t('hotspot_settings.update.title')}
      </Text>
      <Text variant="body1" paddingTop="m" maxFontSizeMultiplier={1}>
        {isLocationChange
          ? 'Update Hotspot location details.'
          : 'Update Hotspot antenna and elevation details.'}
      </Text>
    </Box>
  )
}

export default UpdateHotspotHeader
