import React, { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'lodash'
import BackScreen from '../../../components/BackScreen'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import Box from '../../../components/Box'
import Wifi from '../../../assets/images/wifi-icon.svg'
import CarotRight from '../../../assets/images/carot-right.svg'
import { useColors } from '../../../theme/themeHooks'
import { DebouncedButton as Button } from '../../../components/Button'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Checkmark from '../../../assets/images/check.svg'
import { RootState } from '../../../store/rootReducer'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

const WifiItem = ({
  name,
  isFirst = false,
  isLast = false,
  icon = 'carot',
  onPress,
}: {
  name: string
  isFirst?: boolean
  isLast?: boolean
  icon?: 'carot' | 'check'
  onPress?: () => void
}) => {
  const colors = useColors()
  return (
    <TouchableOpacityBox
      onPress={onPress}
      backgroundColor="white"
      padding="m"
      marginBottom="xxxs"
      flexDirection="row"
      justifyContent="space-between"
      borderTopLeftRadius={isFirst ? 'm' : 'none'}
      borderTopRightRadius={isFirst ? 'm' : 'none'}
      borderBottomLeftRadius={isLast ? 'm' : 'none'}
      borderBottomRightRadius={isLast ? 'm' : 'none'}
    >
      <Text variant="body2Medium" color="black">
        {name}
      </Text>
      {icon === 'carot' && <CarotRight color={colors.graySteel} />}
      {icon === 'check' && <Checkmark />}
    </TouchableOpacityBox>
  )
}

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupPickWifiScreen'>
const HotspotSetupPickWifiScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<HotspotSetupNavigationProp>()
  const rootNav = useNavigation<RootNavigationProp>()

  const { connectedHotspot } = useSelector((state: RootState) => state)
  const {
    params: { networks, connectedNetworks },
  } = useRoute<Route>()
  const { scanForWifiNetworks } = useConnectedHotspotContext()

  const [wifiNetworks, setWifiNetworks] = useState(networks)
  const [connectedWifiNetworks, setConnectedWifiNetworks] = useState(
    connectedNetworks,
  )
  const [scanning, setScanning] = useState(false)

  const handleClose = useCallback(() => rootNav.navigate('MainTabs'), [rootNav])

  const hasNetworks = useMemo(() => {
    if (!wifiNetworks?.length) return false
    return wifiNetworks.length > 0
  }, [wifiNetworks])

  const navSkip = useCallback(() => {
    if (connectedHotspot.status === 'owned') {
      navigation.navigate('OwnedHotspotErrorScreen')
    } else if (connectedHotspot.status === 'global') {
      navigation.navigate('NotHotspotOwnerErrorScreen')
    } else {
      navigation.navigate('HotspotSetupLocationInfoScreen')
    }
  }, [connectedHotspot.status, navigation])

  const navNext = (network: string) => {
    navigation.navigate('HotspotSetupWifiScreen', { network })
  }

  const scanForNetworks = async () => {
    setScanning(true)
    const newNetworks = uniq((await scanForWifiNetworks()) || [])
    const newConnectedNetworks = uniq((await scanForWifiNetworks(true)) || [])
    setScanning(false)
    setWifiNetworks(newNetworks)
    setConnectedWifiNetworks(newConnectedNetworks)
  }

  return (
    <BackScreen
      padding="none"
      backgroundColor="primaryBackground"
      onClose={handleClose}
    >
      <Box backgroundColor="primaryBackground" padding="m" alignItems="center">
        <Box flexDirection="row" justifyContent="center" marginBottom="lm">
          <Wifi />
        </Box>
        <Text
          variant="h1"
          textAlign="center"
          marginBottom="m"
          maxFontSizeMultiplier={1}
        >
          {t('hotspot_setup.wifi_scan.title')}
        </Text>
        <Text
          variant="subtitleLight"
          textAlign="center"
          marginBottom="m"
          maxFontSizeMultiplier={1.1}
        >
          {t('hotspot_setup.wifi_scan.subtitle')}
        </Text>
        <Button
          icon={scanning ? <ActivityIndicator color="white" /> : undefined}
          onPress={scanForNetworks}
          title={t('hotspot_setup.wifi_scan.scan_networks')}
          variant="primary"
          height={50}
          width="90%"
          marginVertical="s"
          disabled={scanning}
          mode="contained"
        />
      </Box>
      <Box paddingHorizontal="l" flex={1} backgroundColor="purple200">
        <FlatList
          data={wifiNetworks}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Box marginTop="l">
              {connectedWifiNetworks.length > 0 && (
                <Box marginBottom="m">
                  <Text
                    variant="body1Bold"
                    marginBottom="s"
                    maxFontSizeMultiplier={1.2}
                  >
                    {t('hotspot_setup.wifi_scan.saved_networks')}
                  </Text>
                  {connectedWifiNetworks.map((network, index) => (
                    <WifiItem
                      key={network}
                      name={network}
                      isFirst={index === 0}
                      isLast={index === connectedWifiNetworks.length - 1}
                      icon="check"
                      onPress={navSkip}
                    />
                  ))}
                </Box>
              )}
              <Text
                variant="body1Bold"
                marginBottom="s"
                maxFontSizeMultiplier={1.2}
                visible={hasNetworks}
              >
                {t('hotspot_setup.wifi_scan.available_networks')}
              </Text>
            </Box>
          }
          renderItem={({ item, index }) => (
            <WifiItem
              name={item}
              isFirst={index === 0}
              isLast={index === wifiNetworks.length - 1}
              onPress={() => navNext(item)}
            />
          )}
          ListEmptyComponent={
            <Box margin="l">
              <Text
                variant="body1Medium"
                marginBottom="l"
                textAlign="center"
                color="purpleLight"
              >
                {t('hotspot_setup.wifi_scan.not_found_title')}
              </Text>
              <Text variant="body1Light" textAlign="center" color="purpleLight">
                {t('hotspot_setup.wifi_scan.not_found_desc')}
              </Text>
            </Box>
          }
        />
        <Button
          variant="primary"
          title={t('hotspot_setup.wifi_scan.ethernet')}
          marginVertical="m"
          onPress={navSkip}
        />
      </Box>
    </BackScreen>
  )
}

export default HotspotSetupPickWifiScreen
