import React, { useEffect, useMemo, useState } from 'react'
import { Hotspot, Witness } from '@helium/http'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert } from 'react-native'
import { useAsync } from 'react-async-hook'
import { Balance, CurrencyType } from '@helium/currency'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-simple-toast'
import Text from '../../../../components/Text'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import Box from '../../../../components/Box'
import Button from '../../../../components/Button'
import * as Logger from '../../../../utils/logger'
import HotspotConfigurationPicker from '../../../../components/HotspotConfigurationPicker'
import animateTransition from '../../../../utils/animateTransition'
import ReassertLocation, {
  Coords,
  ReassertLocationState,
} from '../ReassertLocation'
import UpdateHotspotHeader from './UpdateHotspotHeader'
import { useHotspotSettingsContext } from '../HotspotSettingsProvider'
import HotspotLocationPreview from './HotspotLocationPreview'
import {
  assertLocationTxn,
  loadLocationFeeData,
} from '../../../../utils/assertLocationUtils'
import { getOnboardingRecord } from '../../../../utils/stakingClient'
import useSubmitTxn from '../../../../hooks/useSubmitTxn'
import { decimalSeparator, groupSeparator } from '../../../../utils/i18n'
import { calculateAssertLocFee } from '../../../../utils/fees'
import { MakerAntenna } from '../../../../makers/antennaMakerTypes'
import { isDataOnly } from '../../../../utils/hotspotUtils'

type Props = {
  onClose: () => void
  onCloseSettings: () => void
  hotspot: Hotspot | Witness
}

type State = 'antenna' | 'location' | 'confirm'

const UpdateHotspotConfig = ({ onClose, onCloseSettings, hotspot }: Props) => {
  const { t } = useTranslation()
  const submitTxn = useSubmitTxn()
  const navigation = useNavigation()
  const [state, setState] = useState<State>(
    isDataOnly(hotspot) ? 'location' : 'antenna',
  )
  const [antenna, setAntenna] = useState<MakerAntenna>()
  const [gain, setGain] = useState<number>()
  const [elevation, setElevation] = useState<number>(0)
  const [location, setLocation] = useState<Coords>()
  const [locationName, setLocationName] = useState<string>()
  const [fullScreen, setFullScreen] = useState(false)
  const [isLocationChange, setIsLocationChange] = useState(false)
  const [loading, setLoading] = useState(false)
  const [locationFee, setLocationFee] = useState('')

  const { result: onboardingRecord } = useAsync(
    async () => getOnboardingRecord(hotspot.address),
    [hotspot.address],
  )

  const { enableBack, disableBack } = useHotspotSettingsContext()
  useEffect(() => {
    enableBack(onClose)
  }, [enableBack, onClose])

  const toggleUpdateAntenna = () => {
    animateTransition('UpdateHotspotConfig.ToggleUpdateAntenna', {
      enabledOnAndroid: false,
    })
    setIsLocationChange(false)
    setState('antenna')
  }
  const toggleUpdateLocation = () => {
    animateTransition('UpdateHotspotConfig.ToggleUpdateLocation', {
      enabledOnAndroid: false,
    })
    setIsLocationChange(true)
    setState('location')
  }
  const onConfirm = () => {
    animateTransition('UpdateHotspotConfig.OnConfirm', {
      enabledOnAndroid: false,
    })
    const feeData = calculateAssertLocFee(undefined, undefined, undefined)
    const feeDc = new Balance(feeData.fee, CurrencyType.dataCredit)
    setLocationFee(
      feeDc.toString(0, {
        groupSeparator,
        decimalSeparator,
      }),
    )
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

  const onFinishReassert = async (
    updatedLocation: Coords | undefined,
    name: string,
  ) => {
    if (updatedLocation) {
      const feeData = await loadLocationFeeData({
        dataOnly: isDataOnly(hotspot),
      })
      setLocationFee(
        feeData.totalStakingAmountDC.toString(0, {
          groupSeparator,
          decimalSeparator,
        }),
      )
      setFullScreen(false)
      enableBack(onClose)
      setLocation(updatedLocation)
      setLocationName(name)
      setState('confirm')
      disableBack()
    } else {
      onClose()
    }
  }

  const constructTransaction = async () => {
    if (isLocationChange) {
      if (!location) {
        Logger.error(new Error('Assert failed with null location'))
        Alert.alert(
          t('generic.error'),
          t('hotspot_setup.add_hotspot.assert_loc_error_no_loc'),
        )
        return
      }
      const hotspotGain = hotspot.gain ? hotspot.gain / 10 : 1.2
      return assertLocationTxn(
        hotspot.address,
        location.latitude,
        location.longitude,
        hotspotGain,
        hotspot.elevation,
        onboardingRecord,
        isLocationChange,
      )
    }

    return assertLocationTxn(
      hotspot.address,
      hotspot.lat,
      hotspot.lng,
      gain,
      elevation,
      onboardingRecord,
      false,
    )
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      const txn = await constructTransaction()
      if (txn) {
        await submitTxn(txn)
        navigation.navigate('Wallet')
        onCloseSettings()
        setTimeout(() => {
          Toast.show(t('hotspot_settings.reassert.submit'), Toast.LONG)
        }, 500)
      } else {
        setLoading(false)
        Logger.error(new Error('Assert failed with null txn'))
        Alert.alert(
          t('generic.error'),
          t('hotspot_setup.add_hotspot.assert_loc_error_body'),
        )
      }
    } catch (error) {
      setLoading(false)
      Logger.error(error)
      Alert.alert(
        t('generic.error'),
        t('hotspot_setup.add_hotspot.assert_loc_error_body'),
      )
    }
  }

  const StatePicker = () => {
    if (isDataOnly(hotspot)) return null

    return (
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
  }

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
            {antenna?.name}
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
        {locationFee}
      </Text>
      <Button
        title={t('generic.submit')}
        mode="contained"
        variant="primary"
        icon={loading ? <ActivityIndicator color="white" /> : undefined}
        onPress={onSubmit}
        disabled={loading}
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
              disabled={!antenna}
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
