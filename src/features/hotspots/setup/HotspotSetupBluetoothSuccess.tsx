import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Device } from 'react-native-ble-plx'
import Box from '../../../components/Box'
import HotspotPairingList from '../../../components/HotspotPairingList'
import Text from '../../../components/Text'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'
import Bluetooth from '../../../assets/images/bluetooth.svg'

const HotspotSetupBluetoothSuccess = () => {
  const { t } = useTranslation()
  const [connecting, setConnecting] = useState(false)
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const {
    availableHotspots,
    connectAndConfigHotspot,
  } = useConnectedHotspotContext()

  // console.log('availableHotspots', availableHotspots)
  // const availableHotspots = {
  //   '31D15CD5': {
  //     id: '31D15CD5',
  //     localName: 'Helium Hotspot A15B',
  //     name: 'Helium Hotspot',
  //   },
  //   '61D15CD5': {
  //     id: '61D15CD5',
  //     localName: 'Rak Hotspot Miner F7B4',
  //     name: 'Helium Hotspot',
  //   },
  //   '41D15CD5': {
  //     id: '41D15CD5',
  //     localName: 'Nebra Indoor Hotspot A15BFF',
  //     name: 'Helium Hotspot',
  //   },
  //   '51D15CD5': {
  //     id: '51D15CD5',
  //     localName: 'Nebra Outdoor Hotspot A15BCC',
  //     name: 'Helium Hotspot',
  //   },
  // }

  const handleConnect = async (hotspot: Device) => {
    setConnecting(true)
    await connectAndConfigHotspot(hotspot)
    setConnecting(false)
    navigation.push('HotspotSetupScanWifiScreen')
  }

  return (
    <Box flex={1}>
      <Box padding="lx" backgroundColor="primaryBackground">
        <Box marginBottom="l">
          <Bluetooth />
        </Box>
        <Text
          variant="h1"
          numberOfLines={1}
          adjustsFontSizeToFit
          marginBottom="m"
        >
          {t('hotspot_setup.ble_select.hotspots_found', {
            count: Object.keys(availableHotspots).length,
          })}
        </Text>
        <Text variant="subtitleLight">
          {t('hotspot_setup.ble_select.subtitle')}
        </Text>
      </Box>
      <Box flex={1} paddingHorizontal="lx">
        <HotspotPairingList
          hotspots={Object.values(availableHotspots)}
          onPress={handleConnect}
          disabled={connecting}
        />
      </Box>
    </Box>
  )
}

export default HotspotSetupBluetoothSuccess
