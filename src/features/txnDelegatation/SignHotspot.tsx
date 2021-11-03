import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useAsync } from 'react-async-hook'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { AddGateway, WalletLink, Location } from '@helium/react-native-sdk'
import animalHash from 'angry-purple-tiger'
import Box from '../../components/Box'
import SafeAreaBox from '../../components/SafeAreaBox'
import Text from '../../components/Text'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../navigation/main/tabTypes'
import { getSecureItem, hasAppLinkAuthToken } from '../../utils/secureAccount'

type Route = RouteProp<RootStackParamList, 'SignHotspot'>
const SignHotspot = () => {
  const {
    params: {
      callbackUrl,
      requestAppName,
      token,
      addGatewayTxn,
      assertLocationTxn,
      qrAddGatewayTxn,
      makerName,
    },
  } = useRoute<Route>()
  const navigation = useNavigation<RootNavigationProp>()
  const { t } = useTranslation()
  const { result: address } = useAsync(getSecureItem, ['address'])
  const [hasStoredToken, setHasStoredToken] = useState(false)

  const gatewayTxn = useMemo(() => {
    if (!qrAddGatewayTxn || !addGatewayTxn) return
    return AddGateway.txnFromString(qrAddGatewayTxn || addGatewayTxn)
  }, [addGatewayTxn, qrAddGatewayTxn])

  const locationTxn = useMemo(() => {
    if (!assertLocationTxn) return
    return Location.txnFromString(assertLocationTxn)
  }, [assertLocationTxn])

  const handleLink = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(callbackUrl)
      if (!canOpen || !address) return

      // const time = getUnixTime(new Date())
      // const token = WalletLink.createWalletLinkToken({
      //   time,
      //   address,
      //   requestAppId,
      //   signingAppId: getBundleId(),
      // })
      // await addAppLinkAuthToken(token)
      // const url = `${callbackUrl}link_wallet/${address}?token=${token}&status=success`
      // Linking.openURL(url)
    } catch (e) {
      console.error(e)
    }
    navigation.goBack()
  }, [address, callbackUrl, navigation])

  const handleCancel = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(callbackUrl)
      if (canOpen) {
        // const url = `${callbackUrl}link_wallet/${address}?status=user_cancelled`
        // Linking.openURL(url)
      }
    } catch (e) {
      console.error(e)
    }
    navigation.goBack()
  }, [callbackUrl, navigation])

  const name = useMemo(() => {
    if (!gatewayTxn?.gateway?.b58 && !locationTxn?.gateway?.b58) return
    return animalHash(
      gatewayTxn?.gateway?.b58 || locationTxn?.gateway?.b58 || '',
    )
  }, [gatewayTxn?.gateway?.b58, locationTxn?.gateway?.b58])

  const location = useMemo(() => {
    return locationTxn?.location
  }, [locationTxn?.location])

  useEffect(() => {
    hasAppLinkAuthToken(token).then(setHasStoredToken)
  }, [token])

  const owner = useMemo(() => {
    if (!token || !hasStoredToken) return
    const parsedToken = WalletLink.parseWalletLinkToken(token)
    if (!parsedToken) return
    return parsedToken.address
  }, [hasStoredToken, token])

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      padding="xl"
      justifyContent="space-around"
    >
      <Text variant="h2" textAlign="center">
        {t('signHotspot.title', { appName: requestAppName })}
      </Text>

      <Box>
        <Text variant="body2" textAlign="center" marginBottom="m">
          {t('signHotspot.name', { name })}
        </Text>
        {location && (
          <Text variant="body2" textAlign="center" marginBottom="m">
            {t('signHotspot.location', { location })}
          </Text>
        )}
        {owner && (
          <Text variant="body2" textAlign="center" marginBottom="m">
            {t('signHotspot.owner', { owner })}
          </Text>
        )}
        {makerName && (
          <Text variant="body2" textAlign="center" marginBottom="m">
            {t('signHotspot.maker', { maker: makerName })}
          </Text>
        )}
      </Box>
      <Box>
        <TouchableOpacityBox
          padding="l"
          paddingHorizontal="xxl"
          onPress={handleLink}
        >
          <Text variant="subtitle" textAlign="center" color="white">
            {t('generic.yes')}
          </Text>
        </TouchableOpacityBox>
        <TouchableOpacityBox
          padding="l"
          paddingHorizontal="xxl"
          onPress={handleCancel}
        >
          <Text variant="subtitle" textAlign="center">
            {t('generic.cancel')}
          </Text>
        </TouchableOpacityBox>
      </Box>
    </SafeAreaBox>
  )
}

export default memo(SignHotspot)
