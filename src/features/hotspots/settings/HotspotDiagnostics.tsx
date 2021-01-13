import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  LayoutAnimation,
  Linking,
  Platform,
} from 'react-native'
import { Device } from 'react-native-ble-plx'
import { useSelector } from 'react-redux'
import Text from '../../../components/Text'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import CloseModal from '../../../assets/images/closeModal.svg'
import Box from '../../../components/Box'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import HotspotItem from './HotspotItem'
import { RootState } from '../../../store/rootReducer'
import { useBluetoothContext } from '../../../providers/BluetoothProvider'
import useAlert from '../../../utils/useAlert'

type Props = { onClose: () => void }
const HotspotDiagnostics = ({ onClose }: Props) => {
  const [scanComplete, setScanComplete] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [selectedHotspot, setSelectedHotspot] = useState<Device | undefined>()
  const {
    scanForHotspots,
    availableHotspots,
    connectAndConfigHotspot,
  } = useConnectedHotspotContext()
  const { enable, getState } = useBluetoothContext()
  const { showOKCancelAlert } = useAlert()

  const hotspotCount = Object.keys(availableHotspots).length
  const keys = Object.keys(availableHotspots)
  const { t } = useTranslation()

  const { connectedHotspot } = useSelector((state: RootState) => state)

  const checkBluetooth = async () => {
    const state = await getState()

    if (state === 'PoweredOn') {
      setEnabled(true)
      return
    }

    if (Platform.OS === 'ios') {
      if (state === 'PoweredOff') {
        const decision = await showOKCancelAlert({
          titleKey: 'hotspot_setup.pair.alert_ble_off.title',
          messageKey: 'hotspot_setup.pair.alert_ble_off.body',
          okKey: 'generic.go_to_settings',
        })
        if (decision) Linking.openURL('App-Prefs:Bluetooth')
      } else {
        const decision = await showOKCancelAlert({
          titleKey: 'hotspot_setup.pair.alert_ble_off.title',
          messageKey: 'hotspot_setup.pair.alert_ble_off.body',
          okKey: 'generic.go_to_settings',
        })
        if (decision) Linking.openURL('app-settings:')
      }
    }
    if (Platform.OS === 'android') {
      await enable()
    }
    setEnabled(true)
  }

  useEffect(() => {
    checkBluetooth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const scan = async () => {
      await scanForHotspots(4000)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setScanComplete(true)
    }
    if (!scanComplete && enabled) {
      scan()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanComplete, enabled])

  const handleConnect = (hotspot: Device) => () => {
    setSelectedHotspot(hotspot)
    connectAndConfigHotspot(hotspot)
  }

  return (
    <>
      <Box
        backgroundColor="primaryMain"
        borderTopRightRadius="l"
        borderTopLeftRadius="l"
        padding="m"
        minHeight={194}
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text variant="h4" color="white">
            {t('hotspot_settings.pairing.title')}
          </Text>
          <TouchableOpacityBox onPress={onClose}>
            <CloseModal color="gray" />
          </TouchableOpacityBox>
        </Box>
        <Text variant="body2" color="white" marginTop="l">
          {t('hotspot_settings.pairing.subtitle')}
        </Text>
      </Box>
      <Box padding="l" minHeight={200}>
        {scanComplete &&
          hotspotCount > 0 &&
          keys.map((key) => {
            const hotspot = availableHotspots[key]
            if (!hotspot || !hotspot.name) return null
            console.log({ connectedHotspot })
            return (
              <HotspotItem
                hotspot={hotspot}
                key={hotspot.id}
                onPress={handleConnect(hotspot)}
                connecting={hotspot === selectedHotspot}
                selected={hotspot === selectedHotspot}
                connected={
                  hotspot === selectedHotspot && !!connectedHotspot.address
                }
              />
            )
          })}

        {scanComplete && hotspotCount === 0 && (
          <Text variant="h4" color="black" marginBottom="ms">
            {t('hotspot_settings.diagnostics.no_hotspots')}
          </Text>
        )}
        {!scanComplete && (
          <Box marginTop="l">
            <ActivityIndicator color="black" />
          </Box>
        )}
        {scanComplete && (
          <TouchableOpacityBox
            marginLeft="n_m"
            onPress={() => setScanComplete(false)}
          >
            <Text variant="body1Medium" padding="m" color="purpleMain">
              {t('hotspot_settings.diagnostics.scan_again')}
            </Text>
          </TouchableOpacityBox>
        )}
      </Box>
    </>
  )
}

export default HotspotDiagnostics
