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
import { AntennaModelKeys, AntennaModels } from '../makers'
import { MakerAntenna } from '../makers/antennaMakerTypes'

function gainFloatToString(gainFloat?: number): string {
  return gainFloat != null
    ? gainFloat.toLocaleString(locale, {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
      })
    : ''
}
function gainStringToFloat(gainStr?: string): number | undefined {
  return gainStr
    ? parseFloat(
        gainStr.replace(groupSeparator, '').replace(decimalSeparator, '.'),
      )
    : undefined
}
function elevationStringToInt(elevationStr?: string): number | undefined {
  return elevationStr
    ? parseInt(
        elevationStr.replace(groupSeparator, '').replace(decimalSeparator, '.'),
        10,
      )
    : undefined
}
function elevationIntToString(elevationInt?: number): string {
  return elevationInt != null ? elevationInt.toLocaleString(locale) : ''
}

type Props = {
  onAntennaUpdated: (antenna: MakerAntenna) => void
  onGainUpdated: (gain: number | undefined) => void
  onElevationUpdated: (elevation: number | undefined) => void
  selectedAntenna?: MakerAntenna
  outline?: boolean
  gain?: number
  elevation?: number
}
const HotspotConfigurationPicker = ({
  selectedAntenna,
  onAntennaUpdated,
  onGainUpdated,
  onElevationUpdated,
  outline,
  gain,
  elevation,
}: Props) => {
  const { t } = useTranslation()
  const colors = useColors()

  const gainInputRef = useRef<TextInput | null>(null)
  const elevationInputRef = useRef<TextInput | null>(null)

  // Use state to track temporary raw edits for gain and elevation so that we can delay actual
  // updates (delegated to parent component) until the user has finished editing. This prevents
  // the need to reformat input as the user is actively typing, while ensuring the parent component
  // only receives updates when the user has finished.
  const [isEditingGain, setIsEditingGain] = useState(false)
  const [isEditingElevation, setIsEditingElevation] = useState(false)
  const [tmpGain, setTmpGain] = useState<string | undefined>(
    gain != null ? gainFloatToString(gain) : undefined,
  )
  const [tmpElevation, setTmpElevation] = useState<string | undefined>(
    elevation != null ? elevationIntToString(elevation) : undefined,
  )

  const antennas = useMemo(
    () =>
      AntennaModelKeys.map((k) => ({
        ...AntennaModels[k],
        label: AntennaModels[k].name,
        value: AntennaModels[k].name,
      })).sort((a, b) =>
        a.label.toLocaleLowerCase() > b.label.toLocaleLowerCase() ? 1 : -1,
      ),
    [],
  )

  const onSelectAntenna = (_value: string | number, index: number) => {
    const antenna = antennas[index]
    onAntennaUpdated(antenna)
    onGainUpdated(antenna.gain)
    setTmpGain(gainFloatToString(antenna.gain))
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

  const onChangeGain = (text: string) => {
    if (!isEditingGain) setIsEditingGain(true)
    setTmpGain(text)
  }
  const onDoneEditingGain = () => {
    setIsEditingGain(false)
    const gainStrRaw = tmpGain
    let gainFloat = gainStringToFloat(gainStrRaw)
    if (gainFloat) {
      if (gainFloat < 1) gainFloat = 1
      if (gainFloat >= 15) gainFloat = 15
    }
    const gainStr = gainFloatToString(gainFloat)
    setTmpGain(gainStr)
    onGainUpdated(gainFloat)
  }
  const onChangeElevation = (text: string) => {
    if (!isEditingElevation) setIsEditingElevation(true)
    setTmpElevation(text)
  }
  const onDoneEditingElevation = () => {
    setIsEditingElevation(false)
    const elevationStrRaw = tmpElevation
    const elevationInt = elevationStringToInt(elevationStrRaw)
    const elevationStr = elevationIntToString(elevationInt)
    setTmpElevation(elevationStr)
    onElevationUpdated(elevationInt)
  }

  useEffect(() => {
    if (selectedAntenna) {
      onGainUpdated(selectedAntenna.gain)
      setTmpGain(gainFloatToString(selectedAntenna.gain))
    }
  }, [selectedAntenna, onGainUpdated])

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
        textProps={{ variant: 'medium', fontSize: 16, color: 'black' }}
        initialValue={t('antennas.onboarding.select')}
        data={antennas}
        iconColor="black"
        selectedValue={selectedAntenna?.name}
        onValueSelected={onSelectAntenna}
        buttonProps={{ justifyContent: 'space-between' }}
        padding="m"
        paddingVertical="lm"
        maxModalHeight={700}
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
            <Text
              color="purpleMain"
              marginRight="xs"
              maxFontSizeMultiplier={1.2}
            >
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
              value={isEditingGain ? tmpGain : gainFloatToString(gain)}
              returnKeyType="done"
              maxFontSizeMultiplier={1.2}
              onChangeText={onChangeGain}
              onEndEditing={onDoneEditingGain}
              editable={selectedAntenna?.name === 'Custom Antenna'}
            />
            <Text marginLeft="xxs" maxFontSizeMultiplier={1.2}>
              {t('antennas.onboarding.dbi')}
            </Text>
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
            <Text
              color="purpleMain"
              marginRight="xs"
              maxFontSizeMultiplier={1.2}
            >
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
            maxFontSizeMultiplier={1.2}
            onChangeText={onChangeElevation}
            onEndEditing={onDoneEditingElevation}
            value={
              isEditingElevation
                ? tmpElevation
                : elevationIntToString(elevation)
            }
          />
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

const styles = StyleSheet.create({ textInput: { color: 'black' } })

export default HotspotConfigurationPicker
