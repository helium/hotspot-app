import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import animalHash from 'angry-purple-tiger'
import { FlatList, TouchableOpacity } from 'react-native'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import Card from '../../../components/Card'
import NotConnected from '../../../assets/images/notConnected.svg'
import Paired from '../../../assets/images/paired.svg'
import { useColors } from '../../../theme/themeHooks'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { hp } from '../../../utils/layout'
import Chevron from '../../../assets/images/chevron-right.svg'
import useAlert from '../../../utils/useAlert'
import animateTransition from '../../../utils/animateTransition'
import CircleLoader from '../../../components/CircleLoader'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'

const ItemSeparatorComponent = () => <Box height={1} backgroundColor="white" />

type Props = { onNetworkSelected: (wifi: string) => void; onError: () => void }
const WifiSettings = ({ onNetworkSelected, onError }: Props) => {
  const [networkStatus, setNetworkStatus] = useState<
    'ethernet' | 'wifiConnected' | 'wifiConfigured' | 'notConnected'
  >('notConnected')
  const { greenBright } = useColors()
  const {
    connectedHotspot: { address, ethernetOnline, wifi },
  } = useSelector((state: RootState) => state)
  const {
    scanForWifiNetworks,
    removeConfiguredWifi,
  } = useConnectedHotspotContext()
  const { showOKCancelAlert, showOKAlert } = useAlert()
  const [networks, setNetworks] = useState<string[]>([])
  const [configuredNetworks, setConfiguredNetworks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const errorShown = useRef(false)

  const scanWifi = useCallback(async () => {
    try {
      setLoading(true)
      const wifiNetworks = await scanForWifiNetworks()
      const configured = await scanForWifiNetworks(true)
      animateTransition('WifiSettings.ScanWifi')
      setNetworks(wifiNetworks || [])
      setConfiguredNetworks(configured || [])
      setLoading(false)
    } catch (e) {
      setLoading(false)
      if (errorShown.current) return

      errorShown.current = true
      await showOKAlert({
        titleKey: 'generic.error',
        messageKey: e?.toString(),
      })
      onError()
    }
  }, [scanForWifiNetworks, showOKAlert, onError])

  const maybeForgetConfiguredNetwork = useCallback(
    async (networkToForget?: string) => {
      if (!networkToForget) return
      const decision = await showOKCancelAlert({
        titleKey: 'hotspot_setup.disconnect_dialog.title',
        messageKey: 'hotspot_setup.disconnect_dialog.body',
        messageOptions: { wifiName: networkToForget },
        okKey: 'generic.forget',
      })

      if (!decision) {
        return
      }

      animateTransition('WifiSettings.MaybeForgetConfiguredNetwork')
      setLoading(true)
      await removeConfiguredWifi(networkToForget)
    },
    [removeConfiguredWifi, showOKCancelAlert],
  )

  const handleNetworkSelected = useCallback(
    async (nextWifi: string) => {
      await maybeForgetConfiguredNetwork(
        wifi || (configuredNetworks.length ? configuredNetworks[0] : undefined),
      )
      onNetworkSelected(nextWifi)
    },
    [configuredNetworks, maybeForgetConfiguredNetwork, onNetworkSelected, wifi],
  )

  useEffect(() => {
    scanWifi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (ethernetOnline) {
      setNetworkStatus('ethernet')
      return
    }

    if (wifi) {
      setNetworkStatus('wifiConnected')
      return
    }

    if (configuredNetworks.length) {
      setNetworkStatus('wifiConfigured')
      return
    }

    setNetworkStatus('notConnected')
  }, [ethernetOnline, wifi, configuredNetworks])

  const { t } = useTranslation()

  type ListItem = { item: string; index: number }
  const renderItem = useCallback(
    ({ item, index }: ListItem) => {
      const isFirst = index === 0
      const isLast = index === networks?.length ? networks.length - 1 : 0
      return (
        <TouchableOpacity onPress={() => handleNetworkSelected(item)}>
          <Card
            variant="regular"
            flexDirection="row"
            height={52}
            borderTopLeftRadius={isFirst ? 'm' : 'none'}
            borderTopRightRadius={isFirst ? 'm' : 'none'}
            borderBottomLeftRadius={isLast ? 'm' : 'none'}
            borderBottomRightRadius={isLast ? 'm' : 'none'}
            alignItems="center"
          >
            <Text flex={1} variant="body1Bold" color="black">
              {item}
            </Text>
            <Chevron color="#C1CFEE" />
          </Card>
        </TouchableOpacity>
      )
    },
    [handleNetworkSelected, networks.length],
  )

  const separator = useCallback(() => <ItemSeparatorComponent />, [])

  return (
    <Box padding="l" minHeight={hp(66)}>
      <Text variant="medium" fontSize={21} color="black">
        {animalHash(address || '')}
      </Text>

      <TouchableOpacityBox marginLeft="n_m" onPress={scanWifi}>
        <Text variant="body1Medium" padding="m" color="purpleMain">
          {t('hotspot_settings.diagnostics.scan_again')}
        </Text>
      </TouchableOpacityBox>

      <Box
        flexDirection="row"
        justifyContent="space-between"
        height={48}
        alignItems="center"
      >
        <Text variant="medium" fontSize={15} color="black">
          {t('hotspot_settings.wifi.connected_via')}
        </Text>
        {loading && <CircleLoader loaderSize={24} />}
      </Box>

      <Card
        variant="regular"
        flexDirection="row"
        height={49}
        alignItems="center"
      >
        {!loading && (
          <>
            <Text
              variant="medium"
              fontSize={15}
              color={networkStatus === 'notConnected' ? 'grayMain' : 'black'}
              flex={1}
            >
              {networkStatus === 'ethernet' &&
                t('hotspot_settings.wifi.ethernet')}
              {networkStatus === 'wifiConnected' && wifi}
              {networkStatus === 'wifiConfigured' && configuredNetworks[0]}
              {networkStatus === 'notConnected' &&
                t('hotspot_settings.wifi.not_connected')}
            </Text>
            {(networkStatus === 'notConnected' ||
              networkStatus === 'wifiConfigured') && <NotConnected />}
            {(networkStatus === 'wifiConnected' ||
              networkStatus === 'ethernet') && (
              <Paired color={greenBright} height={18} width={18} />
            )}
          </>
        )}
      </Card>

      <Text
        variant="medium"
        fontSize={15}
        color="black"
        marginBottom="m"
        marginTop="lx"
      >
        {t('hotspot_settings.wifi.available_wifi')}
      </Text>
      <Box flex={1}>
        <FlatList
          data={networks}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          ItemSeparatorComponent={separator}
        />
      </Box>
    </Box>
  )
}

export default memo(WifiSettings)
