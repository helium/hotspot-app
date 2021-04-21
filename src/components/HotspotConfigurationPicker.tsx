import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import HeliumActionSheet from './HeliumActionSheet'
import Box from './Box'
import Text from './Text'
import TouchableOpacityBox from './TouchableOpacityBox'
import InfoIcon from '../assets/images/info-hollow.svg'
import { decimalSeparator, groupSeparator, locale } from '../utils/i18n'
import { useColors } from '../theme/themeHooks'

export type AntennaId =
  | 'helium_us'
  | 'helium_eu'
  | 'rak_hotspot_us'
  | 'rak_hotspot_eu'
  | 'nebra_outdoor'
  | 'nebra_indoor'
  | 'bobcat'
  | 'syncrobit_us'
  | 'syncrobit_eu'
  | 'rak_custom'
  | 'longapone_eu'
  | 'custom'
export type Antenna = { id: AntennaId; gain: number }
export const Antennas: Record<AntennaId, Antenna> = {
  helium_us: { id: 'helium_us', gain: 1.2 },
  helium_eu: { id: 'helium_eu', gain: 2.3 },
  rak_hotspot_us: { id: 'rak_hotspot_us', gain: 2.3 },
  rak_hotspot_eu: { id: 'rak_hotspot_eu', gain: 2.8 },
  nebra_outdoor: { id: 'nebra_outdoor', gain: 3 },
  nebra_indoor: { id: 'nebra_indoor', gain: 3 },
  bobcat: { id: 'bobcat', gain: 4 },
  syncrobit_us: { id: 'syncrobit_us', gain: 1.2 },
  syncrobit_eu: { id: 'syncrobit_eu', gain: 2.3 },
  rak_custom: { id: 'rak_custom', gain: 5.8 },
  longapone_eu: { id: 'longapone_eu', gain: 3 },
  custom: { id: 'custom', gain: 1 },
}

type Props = {
  onAntennaUpdated: (antenna: Antenna) => void
  onGainUpdated: (gain: number) => void
  onElevationUpdated: (elevation: number) => void
  selectedAntenna?: Antenna
  outline?: boolean
}
const HotspotConfigurationPicker = ({
  selectedAntenna,
  onAntennaUpdated,
  onGainUpdated,
  onElevationUpdated,
  outline,
}: Props) => {
  const { t } = useTranslation()
  const colors = useColors()

  const gainInputRef = useRef<TextInput | null>(null)
  const elevationInputRef = useRef<TextInput | null>(null)

  const [elevation, setElevation] = useState<string>()
  const [gain, setGain] = useState<string | undefined>(
    selectedAntenna
      ? selectedAntenna.gain.toLocaleString(locale, {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
        })
      : undefined,
  )

  const onSelectAntenna = (value: string | number, index: number) => {
    const antenna = Object.values(Antennas)[index]
    onAntennaUpdated(antenna)
    onGainUpdated(antenna.gain)
    setGain(
      antenna.gain.toLocaleString(locale, {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
      }),
    )
  }

  const showElevationInfo = () =>
    Alert.alert(
      t('antennas.elevation_info.title'),
      t('antennas.elevation_info.desc'),
    )
  const showGainInfo = () =>
    Alert.alert(t('antennas.gain_info.title'), t('antennas.gain_info.desc'))

  const focusGain = () => {
    gainInputRef.current?.focus()
  }
  const focusElevation = () => {
    elevationInputRef.current?.focus()
  }

  const onChangeGain = (text: string) => setGain(text)
  const onDoneEditingGain = () => {
    const gainFloat = gain
      ? parseFloat(
          gain.replace(groupSeparator, '').replace(decimalSeparator, '.'),
        )
      : 0
    let gainString
    if (!gainFloat || gainFloat <= 1) {
      gainString = '1'
    } else if (gainFloat >= 15) {
      gainString = '15'
    } else {
      gainString = gainFloat.toLocaleString(locale, {
        maximumFractionDigits: 1,
      })
    }
    setGain(gainString)
    onGainUpdated(
      gain
        ? parseFloat(
            gain.replace(groupSeparator, '').replace(decimalSeparator, '.'),
          )
        : 0,
    )
  }

  const onChangeElevation = (text: string) => setElevation(text)
  const onDoneEditingElevation = () => {
    const elevationInteger = elevation
      ? parseInt(
          elevation.replace(groupSeparator, '').replace(decimalSeparator, '.'),
          10,
        )
      : 0
    let stringElevation
    if (!elevationInteger) {
      stringElevation = '0'
    } else {
      stringElevation = elevationInteger.toString()
    }
    setElevation(stringElevation)
    onElevationUpdated(parseInt(stringElevation, 10))
  }

  useEffect(() => {
    if (selectedAntenna) {
      setGain(
        selectedAntenna.gain.toLocaleString(locale, {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
        }),
      )
    }
  }, [selectedAntenna])

  const antennaData = useMemo(
    () =>
      Object.values(Antennas).map((a) => ({
        label: t(`antennas.${a.id}`),
        value: a.id,
      })),
    [t],
  )

  return (
    <Box
      backgroundColor="white"
      borderRadius="m"
      marginVertical="l"
      borderWidth={outline ? 1 : 0}
      borderColor="grayLight"
    >
      <HeliumActionSheet
        title={t('antennas.onboarding.select')}
        prefixVariant="regular"
        prefixFontSize={14}
        initialValue={t('antennas.onboarding.select')}
        data={antennaData}
        carotColor="black"
        selectedValue={selectedAntenna?.id}
        onValueChanged={onSelectAntenna}
        displayTextJustifyContent="space-between"
        padding="m"
        paddingVertical="lm"
      />
      <Box backgroundColor="grayLight" height={1} />
      <TouchableWithoutFeedback onPress={focusGain}>
        <Box
          padding="m"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box flexDirection="row" alignItems="center">
            <Text color="purpleMain" marginRight="xs">
              {t('antennas.onboarding.gain')}
            </Text>
            <TouchableOpacityBox onPress={showGainInfo} padding="xs">
              <InfoIcon color={colors.grayLight} />
            </TouchableOpacityBox>
          </Box>
          <Box
            flexDirection="row"
            alignItems="center"
            visible={gain !== undefined}
          >
            <TextInput
              style={styles.textInput}
              ref={gainInputRef}
              keyboardType="numeric"
              value={gain}
              returnKeyType="done"
              onChangeText={onChangeGain}
              onSubmitEditing={onDoneEditingGain}
              editable={selectedAntenna?.id === 'custom'}
            />
            <Text marginLeft="xxs">{t('antennas.onboarding.dbi')}</Text>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
      <Box backgroundColor="grayLight" height={1} />
      <TouchableWithoutFeedback onPress={focusElevation}>
        <Box
          padding="m"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box flexDirection="row" alignItems="center">
            <Text color="purpleMain" marginRight="xs">
              {t('antennas.onboarding.elevation')}
            </Text>
            <TouchableOpacityBox onPress={showElevationInfo} padding="xs">
              <InfoIcon color={colors.grayLight} />
            </TouchableOpacityBox>
          </Box>
          <TextInput
            ref={elevationInputRef}
            placeholder="0"
            keyboardType="numeric"
            returnKeyType="done"
            onChangeText={onChangeElevation}
            onSubmitEditing={onDoneEditingElevation}
            value={elevation}
          />
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

const styles = StyleSheet.create({ textInput: { color: 'black' } })

export default HotspotConfigurationPicker
