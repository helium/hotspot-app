import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'
import BackScreen from '../../../components/BackScreen'
import Button from '../../../components/Button'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootState } from '../../../store/rootReducer'
import HotspotSetupScanWifiError from './HotspotSetupScanWifiError'
import HotspotSetupScanWifiSuccess from './HotspotSetupScanWifiSuccess'
import { HotspotSetupNavigationProp } from './hotspotSetupTypes'

const HotspotSetupScanWifiScreen = () => {
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const {
    scanForWifiNetworks,
    removeConfiguredWifi,
    checkFirmwareCurrent,
  } = useConnectedHotspotContext()
  const {
    connectedHotspot: { freeAddHotspot },
  } = useSelector((state: RootState) => state)

  const { t } = useTranslation()
  const [checkingFirmware, setCheckingFirmware] = useState(false)
  const [networks, setNetworks] = useState<null | undefined | string[]>(null)
  const [configuredNetworks, setConfiguredNetworks] = useState<
    null | undefined | string[]
  >(null)

  const configuredNetwork = configuredNetworks?.length
    ? configuredNetworks[0]
    : undefined

  const loading = networks === null || configuredNetworks === null
  const hasConfiguredNetwork =
    configuredNetworks && configuredNetworks.length > 0
  const error = !hasConfiguredNetwork && networks && networks.length === 0

  const scanWifi = async () => {
    const wifiNetworks = await scanForWifiNetworks()
    const configuredWifiNetworkds = await scanForWifiNetworks(true)

    setNetworks(wifiNetworks)
    setConfiguredNetworks(configuredWifiNetworkds)
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      scanWifi()
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeConfiguredNetwork = async () => {
    if (!configuredNetwork) return
    await removeConfiguredWifi(configuredNetwork)

    scanWifi()
  }

  const connectNetwork = (network: string) => {
    navigation.push('HotspotSetupWifiScreen', { network })
  }

  const continueWithWifi = async () => {
    setCheckingFirmware(true)
    const hasCurrentFirmware = await checkFirmwareCurrent()
    setCheckingFirmware(false)
    if (hasCurrentFirmware) {
      if (freeAddHotspot) {
        navigation.push('HotspotGenesisScreen')
      } else {
        navigation.push('HotspotSetupAddTxnScreen')
      }
    } else {
      navigation.push('FirmwareUpdateNeededScreen')
    }
  }

  return (
    <BackScreen backgroundColor="primaryBackground">
      {loading && <ActivityIndicator color="white" />}
      {!loading && error && <HotspotSetupScanWifiError />}
      {!loading && !error && (
        <HotspotSetupScanWifiSuccess
          continueWithWifi={continueWithWifi}
          removeConfiguredNetwork={removeConfiguredNetwork}
          configuredNetwork={configuredNetwork}
          connectNetwork={connectNetwork}
          networks={networks}
          disabled={checkingFirmware}
        />
      )}

      {!loading && (
        <Button
          disabled={checkingFirmware}
          variant="primary"
          mode="contained"
          marginTop="l"
          title={t('hotspot_setup.wifi_scan.ethernet')}
          onPress={() => navigation.push('HotspotEthernetScreen')}
        />
      )}
    </BackScreen>
  )
}

export default HotspotSetupScanWifiScreen
