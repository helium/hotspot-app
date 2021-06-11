import React, { useCallback } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import QrIcon from '@assets/images/qr.svg'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'
import { Camera } from 'expo-camera'
import { useAsync } from 'react-async-hook'
import { useDebouncedCallback } from 'use-debounce/lib'
import Toast from 'react-native-simple-toast'
import { StyleSheet, Linking } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { TouchableOpacity } from 'react-native-gesture-handler'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { HotspotSetupStackParamList } from './hotspotSetupTypes'
import { useColors } from '../../../theme/themeHooks'
import { getSecureItem } from '../../../utils/secureAccount'
import { useAppLinkContext } from '../../../providers/AppLinkProvider'
import useHaptic from '../../../utils/useHaptic'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupScanQrScreen'>

const HotspotSetupScanQrScreen = () => {
  const { t, i18n } = useTranslation()
  const { params } = useRoute<Route>()
  const colors = useColors()
  const { result: address } = useAsync(getSecureItem, ['address'])
  const { handleBarCode } = useAppLinkContext()
  const { triggerNotification } = useHaptic()
  const navigation = useNavigation<RootNavigationProp>()

  const handleClose = useCallback(() => navigation.navigate('MainTabs'), [
    navigation,
  ])

  const handleBarCodeScanned = useDebouncedCallback(
    (result: BarCodeScannerResult) => {
      try {
        handleBarCode(result, 'add_gateway', {
          hotspotType: params.hotspotType,
        })
        triggerNotification('success')
      } catch (error) {
        if (error.message) {
          Toast.showWithGravity(error.message, Toast.LONG, Toast.CENTER)
        }
        triggerNotification('error')
      }
    },
    1000,
    { leading: true, trailing: false },
  )

  const copyAddress = useCallback(() => {
    Clipboard.setString(address || '')
    triggerNotification('success')
    Toast.show(t('wallet.copiedToClipboard', { address }))
  }, [address, t, triggerNotification])

  let linkToMaker = null
  const qr1 = t(`makerHotspot.${params.hotspotType}.qr.1`).split(/\|/)
  const url = qr1[0].replace(/WALLET/, address || '')
  const openMakerUrl = useCallback(async () => {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    } else {
      Toast.showWithGravity(
        `Don't know how to open this URL: ${url}`,
        Toast.LONG,
        Toast.CENTER,
      )
    }
  }, [url])

  if (i18n.exists(`makerHotspot.${params.hotspotType}.qr.1`)) {
    linkToMaker = (
      <TouchableOpacity onPress={openMakerUrl}>
        <Text
          variant="bold"
          fontSize={{ smallPhone: 15, phone: 19 }}
          color="purpleMain"
          lineHeight={{ smallPhone: 20, phone: 26 }}
          maxFontSizeMultiplier={1}
        >
          {qr1[1]}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      paddingTop={{ smallPhone: 's', phone: 'lx' }}
      onClose={handleClose}
    >
      <Box
        height={52}
        width={52}
        backgroundColor="purple500"
        borderRadius="m"
        alignItems="center"
        justifyContent="center"
      >
        <QrIcon color={colors.purpleMain} width={30} height={22} />
      </Box>
      <Text
        variant="h1"
        numberOfLines={1}
        lineHeight={{ smallPhone: 42, phone: 62 }}
        fontSize={{ smallPhone: 28, phone: 40 }}
        adjustsFontSizeToFit
        marginTop="s"
      >
        {t('hotspot_setup.qrScan.title')}
      </Text>
      <Text
        variant="subtitle"
        fontSize={{ smallPhone: 15, phone: 19 }}
        lineHeight={{ smallPhone: 20, phone: 26 }}
        maxFontSizeMultiplier={1}
        marginVertical={{ smallPhone: 's', phone: 'l' }}
      >
        {t(`makerHotspot.${params.hotspotType}.qr.0`)}
      </Text>
      {linkToMaker}
      <Text
        variant="subtitle"
        fontSize={{ smallPhone: 15, phone: 19 }}
        lineHeight={{ smallPhone: 20, phone: 26 }}
        maxFontSizeMultiplier={1}
      >
        {t('hotspot_setup.qrScan.wallet_address')}
      </Text>
      <TouchableOpacity onPress={copyAddress}>
        <Text
          variant="bold"
          fontSize={{ smallPhone: 15, phone: 19 }}
          color="purpleMain"
          lineHeight={{ smallPhone: 20, phone: 26 }}
          maxFontSizeMultiplier={1}
        >
          {address}
        </Text>
      </TouchableOpacity>
      <Box flex={1} />

      <Box
        borderRadius="xl"
        overflow="hidden"
        width="100%"
        aspectRatio={1}
        backgroundColor="black"
      >
        <Camera
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={handleBarCodeScanned.callback}
          ratio="1:1"
          style={StyleSheet.absoluteFill}
        />
      </Box>
    </BackScreen>
  )
}

export default HotspotSetupScanQrScreen
