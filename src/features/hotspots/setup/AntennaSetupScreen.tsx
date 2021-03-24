import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { getCountry } from 'react-native-localize'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import BackScreen from '../../../components/BackScreen'
import Text from '../../../components/Text'
import Button from '../../../components/Button'
import DiscoveryModeIcon from '../../../assets/images/discovery_mode_icon.svg'
import { useColors } from '../../../theme/themeHooks'
import HotspotConfigurationPicker, {
  Antenna,
  Antennas,
} from '../../../components/HotspotConfigurationPicker'
import hotspotOnboardingSlice from '../../../store/hotspots/hotspotOnboardingSlice'
import { useAppDispatch } from '../../../store/store'
import { RootState } from '../../../store/rootReducer'

const AntennaSetupScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const colors = useColors()
  const dispatch = useAppDispatch()
  const hotspotType = useSelector(
    (state: RootState) => state.hotspotOnboarding.hotspotType,
  )

  const defaultAntenna = useMemo(() => {
    const country = getCountry()
    const isUS = country === 'US'
    switch (hotspotType) {
      default:
      case 'Helium':
        return isUS ? Antennas.helium_us : Antennas.helium_eu
      case 'NEBRAIN':
        return Antennas.nebra_indoor
      case 'NEBRAOUT':
        return Antennas.nebra_outdoor
      case 'RAK':
        return isUS ? Antennas.rak_hotspot_us : Antennas.rak_hotspot_eu
      case 'Bobcat':
        return Antennas.bobcat
      case 'SYNCROBIT':
        return isUS ? Antennas.syncrobit_us : Antennas.syncrobit_eu
    }
  }, [hotspotType])

  const [antenna, setAntenna] = useState<Antenna>(defaultAntenna)
  const [gain, setGain] = useState<number>(defaultAntenna.gain)
  const [elevation, setElevation] = useState<number>(0)

  const navNext = useCallback(async () => {
    dispatch(hotspotOnboardingSlice.actions.setElevation(elevation))
    dispatch(hotspotOnboardingSlice.actions.setGain(gain))
    dispatch(hotspotOnboardingSlice.actions.setAntenna(antenna))
    navigation.navigate('HotspotSetupConfirmLocationScreen')
  }, [antenna, dispatch, elevation, gain, navigation])

  return (
    <BackScreen>
      <Box flex={1} marginTop="m">
        <Box
          height={52}
          width={52}
          backgroundColor="purple500"
          borderRadius="m"
          alignItems="center"
          justifyContent="center"
        >
          <DiscoveryModeIcon color={colors.purpleMain} width={30} height={22} />
        </Box>
        <Text
          variant="h1"
          marginBottom="s"
          marginTop="l"
          maxFontSizeMultiplier={1}
        >
          {t('antennas.onboarding.title')}
        </Text>
        <Text
          variant="subtitleLight"
          numberOfLines={2}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1.3}
        >
          {t('antennas.onboarding.subtitle')}
        </Text>
        <HotspotConfigurationPicker
          selectedAntenna={antenna}
          onAntennaUpdated={setAntenna}
          onGainUpdated={setGain}
          onElevationUpdated={setElevation}
        />
      </Box>
      <Button
        title={t('generic.next')}
        mode="contained"
        variant="primary"
        onPress={navNext}
      />
    </BackScreen>
  )
}

export default AntennaSetupScreen
