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

type Props = {
  onAntennaUpdated: (antenna: MakerAntenna) => void
  onGainUpdated: (gain: number) => void
  onElevationUpdated: (elevation: number) => void
  selectedAntenna?: MakerAntenna
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

  const [gain, setGain] = useState<string | undefined>(
    selectedAntenna
      ? selectedAntenna.gain.toLocaleString(locale, {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
        })
      : undefined,
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

  const parseGainFloat = (floatString?: string) =>
    floatString
      ? parseFloat(
          floatString
            .replace(groupSeparator, '')
            .replace(decimalSeparator, '.'),
        )
      : 0

  const onChangeGain = (text: string) => {
    let gainFloat = parseGainFloat(text)
    if (!gainFloat || gainFloat <= 1) {
      gainFloat = 1
    } else if (gainFloat >= 15) {
      gainFloat = 15
    }
    setGain(text)
    onGainUpdated(gainFloat)
  }

  const onDoneEditingGain = () => {
    const gainFloat = parseGainFloat(gain)
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
    onGainUpdated(gainFloat)
  }

  const onChangeElevation = (text: string) => {
    const elevationInteger = text
      ? parseInt(
          text.replace(groupSeparator, '').replace(decimalSeparator, '.'),
          10,
        )
      : 0
    let stringElevation
    if (!elevationInteger) {
      stringElevation = '0'
    } else {
      stringElevation = elevationInteger.toString()
    }
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
              value={gain}
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
          />
        </Box>
      </TouchableWithoutFeedback>
    </Box>
  )
}

const styles = StyleSheet.create({ textInput: { color: 'black' } })

export default HotspotConfigurationPicker
