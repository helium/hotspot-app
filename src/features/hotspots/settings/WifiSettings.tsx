import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import animalHash from 'angry-purple-tiger'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
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

type Props = { onNetworkSelected: (wifi: string) => void }
const WifiSettings = ({ onNetworkSelected }: Props) => {
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
  const { showOKCancelAlert } = useAlert()
  const [networks, setNetworks] = useState<string[]>([])
  const [configuredNetworks, setConfiguredNetworks] = useState<string[]>([])

  const scanWifi = async () => {
    const wifiNetworks = await scanForWifiNetworks()
    const configured = await scanForWifiNetworks(true)
    animateTransition()
    setNetworks(wifiNetworks || [])
    setConfiguredNetworks(configured || [])
  }

  const handleNetworkSelected = async (nextWifi: string) => {
    if (wifi || configuredNetworks.length) {
      const wifiName = wifi || configuredNetworks[0]
      const decision = await showOKCancelAlert({
        titleKey: 'hotspot_setup.disconnect_dialog.title',
        messageKey: 'hotspot_setup.disconnect_dialog.body',
        messageOptions: { wifiName },
        okKey: 'generic.forget',
      })
      if (!decision || !wifi) {
        return
      }
      await removeConfiguredWifi(wifi)
    }
    onNetworkSelected(nextWifi)
  }

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

  const renderItem = ({ item, index }: { item: string; index: number }) => {
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
          <Chevron />
        </Card>
      </TouchableOpacity>
    )
  }
  return (
    <Box padding="l" minHeight={hp(66)}>
      <Text variant="medium" fontSize={21} color="black" marginBottom="lx">
        {animalHash(address || '')}
      </Text>

      <Text variant="medium" fontSize={15} color="black" marginBottom="m">
        {t('hotspot_settings.wifi.connected_via')}
      </Text>

      <Card
        variant="regular"
        flexDirection="row"
        height={49}
        alignItems="center"
      >
        <Text
          variant="medium"
          fontSize={15}
          color={networkStatus === 'notConnected' ? 'grayMain' : 'black'}
          flex={1}
        >
          {networkStatus === 'ethernet' && t('hotspot_settings.wifi.ethernet')}
          {networkStatus === 'wifiConnected' && wifi}
          {networkStatus === 'wifiConfigured' && configuredNetworks[0]}
          {networkStatus === 'notConnected' &&
            t('hotspot_settings.wifi.not_connected')}
        </Text>

        {networkStatus === 'notConnected' && <NotConnected />}
        {networkStatus !== 'notConnected' && (
          <Paired color={greenBright} height={18} width={18} />
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
          ItemSeparatorComponent={() => (
            <Box height={1} backgroundColor="white" />
          )}
        />
      </Box>
    </Box>
  )
}

export default WifiSettings
