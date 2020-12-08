import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Easing } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'
import { useConnectedHotspotContext } from '../../../providers/ConnectedHotspotProvider'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotScanningScreen'>

const HotspotScanningScreen = () => {
  const rotateAnim = useRef(new Animated.Value(0))
  const { t } = useTranslation()
  const { scanForHotspots } = useConnectedHotspotContext()

  const { params } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()

  const anim = () =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim.current, {
          toValue: -3,
          duration: 6000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
    ).start()

  useEffect(() => {
    const scan = async () => {
      anim()
      await scanForHotspots(6000)
      navigation.replace('HotspotSetupBluetoothScreen', params)
    }
    scan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      alignItems="center"
    >
      <Box flex={1} />

      <Animated.Image
        source={require('../../../assets/images/loading.png')}
        style={{
          transform: [
            {
              rotate: rotateAnim.current.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}
      />
      <Text
        marginTop="xl"
        variant="body2Light"
        numberOfLines={1}
        adjustsFontSizeToFit
        textAlign="center"
      >
        {t('hotspot_setup.ble_scan.title')}
      </Text>
      <Box flex={1} />
      <Button
        marginBottom="m"
        justifyContent="flex-end"
        onPress={navigation.goBack}
        variant="primary"
        mode="text"
        title={t('hotspot_setup.ble_scan.cancel')}
      />
    </SafeAreaBox>
  )
}

export default HotspotScanningScreen
