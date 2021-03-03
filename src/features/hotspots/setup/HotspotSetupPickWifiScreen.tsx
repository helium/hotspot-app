import React, { useCallback } from 'react'
import { FlatList } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
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
import { getAddress, getHotspotDetails } from '../../../utils/appDataClient'
import * as Logger from '../../../utils/logger'
import useAlert from '../../../utils/useAlert'
import { RootState } from '../../../store/rootReducer'

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
  const { connectedHotspot } = useSelector((state: RootState) => state)
  const {
    params: { networks, connectedNetworks },
  } = useRoute<Route>()
  const { showOKAlert } = useAlert()

  const navSkip = useCallback(async () => {
    if (connectedHotspot.address) {
      const address = await getAddress()
      const hotspot = await getHotspotDetails(connectedHotspot.address)
      if (hotspot && hotspot.owner === address) {
        navigation.navigate('OwnedHotspotErrorScreen')
      } else if (hotspot && hotspot.owner !== address) {
        navigation.navigate('NotHotspotOwnerErrorScreen')
      } else {
        navigation.navigate('HotspotSetupLocationInfoScreen')
      }
    } else {
      Logger.error('no connectedHotspot address when skipping wifi')
      showOKAlert({
        titleKey: 'generic.error',
        messageKey: 'hotspot_setup.onboarding_error.disconnected',
      })
      navigation.goBack()
    }
  }, [connectedHotspot.address, navigation, showOKAlert])

  const navNext = (network: string) => {
    navigation.navigate('HotspotSetupWifiScreen', { network })
  }

  return (
    <BackScreen padding="none" backgroundColor="primaryBackground">
      <Box backgroundColor="primaryBackground" padding="m">
        <Box flexDirection="row" justifyContent="center" marginBottom="lm">
          <Wifi />
        </Box>
        <Text variant="h1" textAlign="center" marginBottom="m">
          {t('hotspot_setup.wifi_scan.title')}
        </Text>
        <Text variant="subtitleLight" textAlign="center" marginBottom="m">
          {t('hotspot_setup.wifi_scan.subtitle')}
        </Text>
      </Box>
      <Box paddingHorizontal="lx" flex={1} backgroundColor="purple200">
        <FlatList
          data={networks}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Box marginTop="lx">
              {connectedNetworks.length > 0 && (
                <Box marginBottom="m">
                  <Text variant="body1Bold" marginBottom="s">
                    {t('hotspot_setup.wifi_scan.saved_networks')}
                  </Text>
                  {connectedNetworks.map((network, index) => (
                    <WifiItem
                      key={network}
                      name={network}
                      isFirst={index === 0}
                      isLast={index === connectedNetworks.length - 1}
                      icon="check"
                      onPress={navSkip}
                    />
                  ))}
                </Box>
              )}
              <Text variant="body1Bold" marginBottom="s">
                {t('hotspot_setup.wifi_scan.available_networks')}
              </Text>
            </Box>
          }
          renderItem={({ item, index }) => (
            <WifiItem
              name={item}
              isFirst={index === 0}
              isLast={index === networks.length - 1}
              onPress={() => navNext(item)}
            />
          )}
          ListFooterComponent={
            <Box>
              <Button
                variant="primary"
                mode="contained"
                title={t('hotspot_setup.wifi_scan.ethernet')}
                marginTop="l"
                onPress={navSkip}
              />
            </Box>
          }
        />
      </Box>
    </BackScreen>
  )
}

export default HotspotSetupPickWifiScreen
