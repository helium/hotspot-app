import React, { useCallback, useMemo } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import QrIcon from '@assets/images/qr.svg'
import LinkIcon from '@assets/images/webLink.svg'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'
import { Camera } from 'expo-camera'
import { useAsync } from 'react-async-hook'
import { useDebouncedCallback } from 'use-debounce/lib'
import Toast from 'react-native-simple-toast'
import { StyleSheet, Linking, ScrollView } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { TouchableOpacity } from 'react-native-gesture-handler'
import BackScreen from '../../../components/BackScreen'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { HotspotSetupStackParamList } from './hotspotSetupTypes'
import { useColors, useBorderRadii } from '../../../theme/themeHooks'
import { getSecureItem } from '../../../utils/secureAccount'
import { useAppLinkContext } from '../../../providers/AppLinkProvider'
import useHaptic from '../../../utils/useHaptic'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import { HotspotMakerModels } from '../../../makers'

type Route = RouteProp<HotspotSetupStackParamList, 'HotspotSetupExternalScreen'>

const HotspotSetupExternalScreen = () => {
  const { t } = useTranslation()
  const { params } = useRoute<Route>()
  const colors = useColors()
  const { xl } = useBorderRadii()
  const { result: address } = useAsync(getSecureItem, ['address'])
  const { handleBarCode } = useAppLinkContext()
  const { triggerNotification } = useHaptic()
  const navigation = useNavigation<RootNavigationProp>()

  const isQr = useMemo(
    () => HotspotMakerModels[params.hotspotType].onboardType === 'QR',
    [params.hotspotType],
  )

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

  const openMakerUrl = useCallback(
    (url: string) => async () => {
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
    },
    [],
  )

  const linkToMaker = useMemo(() => {
    const { onboardUrl } = HotspotMakerModels[params.hotspotType]

    if (!onboardUrl) return null
    const url = onboardUrl.replace(/WALLET/, address || '')
    return (
      <TouchableOpacity onPress={openMakerUrl(url)}>
        <Text
          variant="bold"
          fontSize={{ smallPhone: 15, phone: 19 }}
          color="purpleMain"
          lineHeight={{ smallPhone: 20, phone: 26 }}
          maxFontSizeMultiplier={1}
          numberOfLines={1}
          marginVertical="m"
        >
          {url}
        </Text>
      </TouchableOpacity>
    )
  }, [address, openMakerUrl, params.hotspotType])

  const subtitle = useMemo(() => {
    const onboard = t(`makerHotspot.${params.hotspotType}.externalOnboard`, {
      returnObjects: true,
    })

    const isArray = Array.isArray(onboard)
    if (isArray && onboard.length) {
      return onboard[0]
    }
    if (!isArray) {
      return onboard
    }
    return ''
  }, [params.hotspotType, t])

  const additionalPhrases = useMemo(() => {
    const onboard = t(`makerHotspot.${params.hotspotType}.externalOnboard`, {
      returnObjects: true,
    })

    const isArray = Array.isArray(onboard)
    if (isArray && onboard.length > 1) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [first, ...rest] = onboard
      return rest
    }
  }, [params.hotspotType, t])

  const scrollViewStyle = useMemo(() => ({ borderRadius: xl }), [xl])

  return (
    <BackScreen
      backgroundColor="primaryBackground"
      paddingTop={{ smallPhone: 's', phone: 'lx' }}
      onClose={handleClose}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={scrollViewStyle}>
        <Box
          height={52}
          width={52}
          backgroundColor="purple500"
          borderRadius="m"
          alignItems="center"
          justifyContent="center"
        >
          {isQr ? (
            <QrIcon color={colors.purpleMain} width={24} height={24} />
          ) : (
            <LinkIcon color={colors.purpleMain} width={30} height={30} />
          )}
        </Box>
        <Text
          variant="h1"
          numberOfLines={1}
          lineHeight={{ smallPhone: 42, phone: 62 }}
          fontSize={{ smallPhone: 28, phone: 40 }}
          adjustsFontSizeToFit
          marginTop="s"
        >
          {t(`hotspot_setup.external.${isQr ? 'qr' : 'web'}Title`)}
        </Text>
        <Text
          variant="subtitle"
          fontSize={{ smallPhone: 15, phone: 19 }}
          lineHeight={{ smallPhone: 20, phone: 26 }}
          maxFontSizeMultiplier={1}
          marginTop={{ smallPhone: 's', phone: 'l' }}
          marginBottom={
            linkToMaker ? undefined : { smallPhone: 's', phone: 'l' }
          }
        >
          {subtitle}
        </Text>
        {linkToMaker}
        <Text
          variant="subtitle"
          fontSize={{ smallPhone: 15, phone: 19 }}
          lineHeight={{ smallPhone: 20, phone: 26 }}
          maxFontSizeMultiplier={1}
        >
          {t('hotspot_setup.external.wallet_address')}
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

        {isQr && (
          <>
            <Box flex={1} />
            <Box
              marginTop="m"
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
          </>
        )}
        {additionalPhrases &&
          additionalPhrases.map((phrase, idx) => (
            <Text
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              variant="subtitle"
              fontSize={{ smallPhone: 15, phone: 19 }}
              lineHeight={{ smallPhone: 20, phone: 26 }}
              marginTop={{ smallPhone: 's', phone: 'l' }}
              maxFontSizeMultiplier={1}
            >
              {phrase}
            </Text>
          ))}
      </ScrollView>
    </BackScreen>
  )
}

export default HotspotSetupExternalScreen
