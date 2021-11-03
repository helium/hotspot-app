import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { memo, useCallback } from 'react'
import { useAsync } from 'react-async-hook'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { getUnixTime } from 'date-fns'
import { WalletLink } from '@helium/react-native-sdk'
import { getBundleId } from 'react-native-device-info'
import Box from '../../components/Box'
import SafeAreaBox from '../../components/SafeAreaBox'
import Text from '../../components/Text'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../navigation/main/tabTypes'
import { addAppLinkAuthToken, getSecureItem } from '../../utils/secureAccount'

type Route = RouteProp<RootStackParamList, 'LinkWallet'>
const LinkWallet = () => {
  const {
    params: { callbackUrl, requestAppId, requestAppName },
  } = useRoute<Route>()
  const navigation = useNavigation<RootNavigationProp>()
  const { t } = useTranslation()
  const { result: address } = useAsync(getSecureItem, ['address'])

  const handleLink = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(callbackUrl)
      if (!canOpen || !address) return

      const time = getUnixTime(new Date())
      const token = WalletLink.createWalletLinkToken({
        time,
        address,
        requestAppId,
        signingAppId: getBundleId(),
      })
      await addAppLinkAuthToken(token)
      const url = `${callbackUrl}link_wallet/${address}?token=${token}&status=success`
      Linking.openURL(url)
    } catch (e) {
      console.error(e)
    }
    navigation.goBack()
  }, [address, callbackUrl, navigation, requestAppId])

  const handleCancel = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(callbackUrl)
      if (canOpen) {
        const url = `${callbackUrl}link_wallet/${address}?status=user_cancelled`
        Linking.openURL(url)
      }
    } catch (e) {
      console.error(e)
    }
    navigation.goBack()
  }, [address, callbackUrl, navigation])

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      padding="xl"
      justifyContent="space-around"
    >
      <Text variant="h2" textAlign="center">
        {t('linkWallet.title', { appName: requestAppName })}
      </Text>
      <Text variant="body1" textAlign="center">
        {t('linkWallet.body', { appName: requestAppName })}
      </Text>
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

export default memo(LinkWallet)
