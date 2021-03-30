import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Hotspot } from '@helium/http'
import Text from '../../../../components/Text'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import CloseModal from '../../../../assets/images/closeModal.svg'
import DiscoveryIcon from '../../../../assets/images/discovery_mode_icon.svg'
import Box from '../../../../components/Box'
import Button from '../../../../components/Button'
import { useHotspotSettingsContext } from '../HotspotSettingsProvider'
import { useColors } from '../../../../theme/themeHooks'
import HotspotConfigurationPicker, {
  Antenna,
  Antennas,
} from '../../../../components/HotspotConfigurationPicker'
import animateTransition from '../../../../utils/animateTransition'
import ReassertLocation from '../ReassertLocation'

type Props = {
  onClose: () => void
  hotspot: Hotspot
}

type State = 'antenna' | 'location'

const UpdateHotspotConfig = ({ onClose, hotspot }: Props) => {
  const { t } = useTranslation()
  const { enableBack } = useHotspotSettingsContext()
  const colors = useColors()

  const [state, setState] = useState<State>('antenna')

  // TODO: Load current antenna data from API
  const [antenna, setAntenna] = useState<Antenna>(Antennas.helium_us)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gain, setGain] = useState<number>(antenna.gain)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [elevation, setElevation] = useState<number>(0)

  const toggleUpdateAntenna = () => {
    animateTransition()
    setState('antenna')
  }
  const toggleUpdateLocation = () => {
    animateTransition()
    setState('location')
  }
  const updatingAntenna = useMemo(() => state === 'antenna', [state])
  const updatingLocation = useMemo(() => state === 'location', [state])

  useEffect(() => {
    enableBack(onClose)
  }, [enableBack, onClose])

  const StatePicker = () => (
    <Box flexDirection="row" borderRadius="m">
      <TouchableOpacityBox
        onPress={toggleUpdateAntenna}
        padding="s"
        backgroundColor={updatingAntenna ? 'purpleMain' : 'white'}
        width="50%"
        borderTopWidth={1}
        borderBottomWidth={1}
        borderLeftWidth={1}
        borderColor="purpleMain"
        borderTopLeftRadius="m"
        borderBottomLeftRadius="m"
      >
        <Text
          textAlign="center"
          color={updatingAntenna ? 'white' : 'purpleMain'}
        >
          Update Antenna
        </Text>
      </TouchableOpacityBox>
      <TouchableOpacityBox
        onPress={toggleUpdateLocation}
        padding="s"
        width="50%"
        borderTopRightRadius="m"
        borderBottomRightRadius="m"
        borderTopWidth={1}
        borderBottomWidth={1}
        borderRightWidth={1}
        borderColor="purpleMain"
        backgroundColor={updatingLocation ? 'purpleMain' : 'white'}
      >
        <Text
          textAlign="center"
          color={updatingLocation ? 'white' : 'purpleMain'}
        >
          Update Location
        </Text>
      </TouchableOpacityBox>
    </Box>
  )

  return (
    <>
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
          <DiscoveryIcon color="white" width={35} height={25} />
          <TouchableOpacityBox onPress={onClose}>
            <CloseModal color={colors.blackTransparent} />
          </TouchableOpacityBox>
        </Box>
        <Text variant="h2" paddingTop="m" maxFontSizeMultiplier={1}>
          Update Hotspot
        </Text>
        <Text variant="body1" paddingTop="m" maxFontSizeMultiplier={1}>
          Set your Antenna and Hotspot Location
        </Text>
      </Box>
      <Box padding="l">
        <StatePicker />
        {updatingAntenna && (
          <>
            <HotspotConfigurationPicker
              outline
              onAntennaUpdated={setAntenna}
              onGainUpdated={setGain}
              onElevationUpdated={setElevation}
              selectedAntenna={antenna}
            />
            <Button
              title={t('generic.next')}
              mode="contained"
              variant="primary"
              onPress={() => undefined}
            />
          </>
        )}
        {updatingLocation && (
          <ReassertLocation hotspot={hotspot} onFinished={onClose} />
        )}
      </Box>
    </>
  )
}

export default UpdateHotspotConfig
