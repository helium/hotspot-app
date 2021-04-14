import React, { useEffect, useMemo, useState } from 'react'
import { Hotspot } from '@helium/http'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'
import { useAsync } from 'react-async-hook'
import { getCountry } from 'react-native-localize'
import Text from '../../../../components/Text'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import Box from '../../../../components/Box'
import Button from '../../../../components/Button'
import * as Logger from '../../../../utils/logger'
import HotspotConfigurationPicker, {
  Antenna,
  Antennas,
} from '../../../../components/HotspotConfigurationPicker'
import animateTransition from '../../../../utils/animateTransition'
import ReassertLocation, {
  Coords,
  ReassertLocationState,
} from '../ReassertLocation'
import UpdateHotspotHeader from './UpdateHotspotHeader'
import { useHotspotSettingsContext } from '../HotspotSettingsProvider'
import HotspotLocationPreview from './HotspotLocationPreview'
import { assertLocationTxn } from '../../../../utils/assertLocationUtils'
import { getOnboardingRecord } from '../../../../utils/stakingClient'
import useSubmitTxn from '../../../../hooks/useSubmitTxn'

type Props = {
  onClose: () => void
  hotspot: Hotspot
}

type State = 'antenna' | 'location' | 'confirm'

const UpdateHotspotConfig = ({ onClose, hotspot }: Props) => {
  const { t } = useTranslation()
  const submitTxn = useSubmitTxn()
  const country = getCountry()
  const [state, setState] = useState<State>('antenna')

  // TODO: Load current antenna data from API
  const [antenna, setAntenna] = useState<Antenna>(Antennas.helium_us)
  const [gain, setGain] = useState<number>(antenna.gain)
  const [elevation, setElevation] = useState<number>(0)
  const [location, setLocation] = useState<Coords>()
  const [locationName, setLocationName] = useState<string>()
  const [fullScreen, setFullScreen] = useState(false)
  const [isLocationChange, setIsLocationChange] = useState(false)

  const { result: onboardingRecord } = useAsync(async () => {
    const record = await getOnboardingRecord(hotspot.address)
    const isUS = country === 'US'
    let defaultAntenna
    switch (record.makerId) {
      default:
      case 1:
      case 3:
        defaultAntenna = isUS ? Antennas.helium_us : Antennas.helium_eu
        break
      case 2:
        defaultAntenna = isUS
          ? Antennas.rak_hotspot_us
          : Antennas.rak_hotspot_eu
        break
      case 4:
        defaultAntenna = Antennas.nebra_indoor
        break
      case 5:
        defaultAntenna = isUS ? Antennas.syncrobit_us : Antennas.syncrobit_eu
        break
      case 6:
        defaultAntenna = Antennas.bobcat
        break
    }
    setAntenna(defaultAntenna)
    setGain(defaultAntenna.gain)
    return record
  }, [hotspot.address, country])

  const { enableBack } = useHotspotSettingsContext()
  useEffect(() => {
    enableBack(onClose)
  }, [enableBack, onClose])

  const toggleUpdateAntenna = () => {
    animateTransition()
    setIsLocationChange(false)
    setState('antenna')
  }
  const toggleUpdateLocation = () => {
    animateTransition()
    setIsLocationChange(true)
    setState('location')
  }
  const onConfirm = () => {
    animateTransition()
    setState('confirm')
  }
  const updatingAntenna = useMemo(() => state === 'antenna', [state])
  const updatingLocation = useMemo(() => state === 'location', [state])
  const confirmingUpdate = useMemo(() => state === 'confirm', [state])

  const onReassertStateChange = (reassertState: ReassertLocationState) => {
    switch (reassertState) {
      case 'fee':
        setFullScreen(false)
        break
      case 'confirm':
        setFullScreen(true)
        break
      case 'search':
        setFullScreen(true)
        break
      case 'update':
        setFullScreen(true)
        break
    }
  }

  const onFinishReassert = (
    updatedLocation: Coords | undefined,
    name: string,
  ) => {
    if (updatedLocation) {
      setFullScreen(false)
      enableBack(onClose)
      setLocation(updatedLocation)
      setLocationName(name)
      setState('confirm')
    } else {
      onClose()
    }
  }

  const onSubmit = async () => {
    try {
      const txn = await assertLocationTxn(
        hotspot.address,
        location?.latitude || hotspot.lat,
        location?.longitude || hotspot.lng,
        gain,
        elevation,
        hotspot.nonce,
        onboardingRecord,
        isLocationChange,
      )
      if (txn) {
        await submitTxn(txn)
      } else {
        Logger.error(new Error('Assert failed with null txn'))
        Alert.alert(
          t('generic.error'),
          t('hotspot_setup.add_hotspot.assert_loc_error_body'),
        )
      }
    } catch (error) {
      Logger.error(error)
      Alert.alert(
        t('generic.error'),
        t('hotspot_setup.add_hotspot.assert_loc_error_body'),
      )
    }
  }

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
          {t('hotspot_settings.reassert.update_antenna')}
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
          {t('hotspot_settings.options.reassert')}
        </Text>
      </TouchableOpacityBox>
    </Box>
  )

  const ConfirmDetails = () => (
    <Box>
      {isLocationChange && location ? (
        <Box>
          <Text variant="body1Medium" color="black" marginBottom="s">
            {t('hotspot_settings.reassert.new_location')}
          </Text>
          <HotspotLocationPreview
            mapCenter={[location.longitude, location.latitude]}
            locationName={locationName}
          />
        </Box>
      ) : (
        <Box>
          <Text variant="body1Medium" color="black" marginBottom="s">
            {t('hotspot_settings.reassert.antenna_details')}
          </Text>
          <Text variant="body1Medium" color="grayLightText" marginBottom="s">
            {t(`antennas.${antenna.id}`)}
          </Text>
          <Text
            variant="body1Medium"
            color="black"
            marginTop="m"
            marginBottom="s"
          >
            {t('antennas.onboarding.gain')}
          </Text>
          <Text variant="body1Medium" color="grayLightText" marginBottom="s">
            {t('hotspot_setup.location_fee.gain', { gain })}
          </Text>
          <Text
            variant="body1Medium"
            color="black"
            marginTop="m"
            marginBottom="s"
          >
            {t('antennas.onboarding.elevation')}
          </Text>
          <Text variant="body1Medium" color="grayLightText" marginBottom="s">
            {elevation}
          </Text>
        </Box>
      )}
      <Text variant="body1Medium" color="black" marginTop="m" marginBottom="s">
        {t('generic.fee')}
      </Text>
      <Text variant="body1Medium" color="grayLightText" marginBottom="l">
        55,000 DC
      </Text>
      <Button
        title={t('generic.submit')}
        mode="contained"
        variant="primary"
        onPress={onSubmit}
      />
    </Box>
  )

  return (
    <>
      {!fullScreen && (
        <UpdateHotspotHeader
          onClose={onClose}
          isLocationChange={isLocationChange}
        />
      )}
      <Box padding={fullScreen ? undefined : 'l'}>
        {!fullScreen && !confirmingUpdate && <StatePicker />}
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
              title={t('hotspot_settings.reassert.update_antenna')}
              mode="contained"
              variant="primary"
              onPress={onConfirm}
            />
          </>
        )}
        {updatingLocation && (
          <ReassertLocation
            hotspot={hotspot}
            onFinished={onFinishReassert}
            onStateChange={onReassertStateChange}
            onboardingRecord={onboardingRecord}
          />
        )}
        {confirmingUpdate && <ConfirmDetails />}
      </Box>
    </>
  )
}

export default UpdateHotspotConfig
