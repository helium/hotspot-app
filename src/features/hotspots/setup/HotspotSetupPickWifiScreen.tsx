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
import Button from '../../../components/Button'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Checkmark from '../../../assets/images/check.svg'
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
      <Box paddingHorizontal="l" flex={1} backgroundColor="purple200">
        <FlatList
          data={networks}
          keyExtractor={(item) => item}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Box marginTop="l">
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
        />
        <Button
          variant="primary"
          mode="contained"
          title={t('hotspot_setup.wifi_scan.ethernet')}
          marginVertical="m"
          onPress={navSkip}
        />
      </Box>
    </BackScreen>
  )
}

export default HotspotSetupPickWifiScreen
