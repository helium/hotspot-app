import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Device } from 'react-native-ble-plx'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import Paired from '../../../assets/images/paired.svg'
import { HotspotOptions, HotspotOptionsKeys } from './HotspotSettingsTypes'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Diagnostic from '../../../assets/images/diagnostic.svg'
import Wifi from '../../../assets/images/wifi.svg'
import Reassert from '../../../assets/images/reassert.svg'
import Firmware from '../../../assets/images/firmware.svg'
import Chevron from '../../../assets/images/chevron-right.svg'
import { useColors } from '../../../theme/themeHooks'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
import animateTransition from '../../../utils/animateTransition'

type Opts = 'scan' | HotspotOptions
type Props = { hotspot?: Device; optionSelected: (option: Opts) => void }
const HotspotDiagnosticOptions = ({ hotspot, optionSelected }: Props) => {
  const { t } = useTranslation()
  const {
    connectedHotspot: { firmware },
  } = useSelector((state: RootState) => state)

  const { purpleMain } = useColors()
  const { checkFirmwareCurrent } = useConnectedHotspotContext()

  useEffect(() => {
    if (!firmware?.version) {
      checkFirmwareCurrent()
    }
  }, [firmware, checkFirmwareCurrent])

  const selectOption = (opt: Opts) => {
    animateTransition()
    optionSelected(opt)
  }

  return (
    <Box padding="l">
      <Box flexDirection="row" alignItems="center" marginBottom="l">
        <Paired color={purpleMain} />
        <Box marginLeft="ms">
          <Text variant="h4" color="black">
            {t('hotspot_settings.options.paired')}
          </Text>
          <Text variant="body2" color="purpleMain">
            {hotspot?.localName || ''}
          </Text>
        </Box>
      </Box>
      {HotspotOptionsKeys.map((k, index) => {
        return (
          <TouchableOpacityBox
            key={k}
            flexDirection="row"
            alignItems="center"
            backgroundColor="whitePurple"
            marginBottom="xxxs"
            height={48}
            disabled={k === 'firmware'}
            onPress={() => selectOption(k)}
            paddingHorizontal="m"
            borderBottomLeftRadius={
              index === HotspotOptionsKeys.length - 1 ? 'l' : undefined
            }
            borderBottomRightRadius={
              index === HotspotOptionsKeys.length - 1 ? 'l' : undefined
            }
            borderTopLeftRadius={index === 0 ? 'l' : undefined}
            borderTopRightRadius={index === 0 ? 'l' : undefined}
          >
            {k === 'diagnostic' && <Diagnostic />}
            {k === 'wifi' && <Wifi />}
            {k === 'reassert' && <Reassert />}
            {k === 'firmware' && <Firmware />}
            <Text variant="body1" color="black" marginLeft="ms" flex={1}>
              {t(`hotspot_settings.options.${k}`)}
            </Text>
            {k === 'firmware' && (
              <Text variant="body1" color="purpleMain">
                {firmware?.version}
              </Text>
            )}
            {k !== 'firmware' && <Chevron />}
          </TouchableOpacityBox>
        )
      })}

      <TouchableOpacityBox
        marginLeft="n_m"
        onPress={() => {
          selectOption('scan')
        }}
      >
        <Text variant="body1Medium" padding="m" color="purpleMain">
          {t('hotspot_settings.diagnostics.scan_again')}
        </Text>
      </TouchableOpacityBox>
    </Box>
  )
}

export default HotspotDiagnosticOptions
