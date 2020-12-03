import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import Box from '../../../components/Box'
import Button from '../../../components/Button'
import SafeAreaBox from '../../../components/SafeAreaBox'
import Text from '../../../components/Text'
import { hp, wp } from '../../../utils/layout'
import Phone from '../../../assets/images/phone.svg'
import { useBluetoothContext } from '../../../utils/BluetoothProvider'
import {
  HotspotSetupNavigationProp,
  HotspotSetupStackParamList,
} from './hotspotSetupTypes'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotScanningScreen'>

const HotspotScanningScreen = () => {
  const rotateAnim = useRef(new Animated.Value(0))
  const opacityAnim = useRef(new Animated.Value(0))
  const { t } = useTranslation()
  const { scanForHotspots } = useBluetoothContext()

  const { params } = useRoute<Route>()
  const navigation = useNavigation<HotspotSetupNavigationProp>()

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim.current, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(opacityAnim.current, {
          toValue: 1,
          delay: 100,
          duration: 2900,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim.current, {
          toValue: 0,
          delay: 100,
          duration: 2900,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [])

  useEffect(() => {
    const scan = async () => {
      await scanForHotspots(6000)
      navigation.replace('HotspotSetupBluetoothScreen', params)
    }
    scan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SafeAreaBox backgroundColor="secondaryBackground" flex={1}>
      <Box
        overflow="hidden"
        position="absolute"
        height={hp(100)}
        width={hp(100)}
      >
        <Animated.Image
          source={require('../../../assets/images/scanning-bg.png')}
          style={{
            opacity: opacityAnim.current,
            position: 'absolute',
            height: hp(120),
            width: hp(120),
            top: -hp(10),
            left: wp(60) - hp(65),
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
      </Box>
      <Box flex={1} />
      <Box alignItems="center">
        <Phone />
      </Box>
      <Box flex={1} alignItems="center">
        <Text
          variant="header"
          numberOfLines={1}
          adjustsFontSizeToFit
          margin="s"
        >
          {t('hotspot_setup.ble_scan.title')}
        </Text>
        <Text variant="bodyLight">{t('hotspot_setup.ble_scan.subtitle')}</Text>
        <Button
          marginBottom="m"
          flex={1}
          justifyContent="flex-end"
          onPress={navigation.goBack}
          variant="primary"
          mode="text"
          title={t('hotspot_setup.ble_scan.cancel')}
        />
      </Box>
    </SafeAreaBox>
  )
}

export default HotspotScanningScreen
