import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { memo, useCallback } from 'react'
import { useAsync } from 'react-async-hook'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { getUnixTime } from 'date-fns'
import { WalletLink } from '@helium/react-native-sdk'
import { getBundleId } from 'react-native-device-info'
import qs from 'qs'
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
    params: { requestAppId, requestAppName },
  } = useRoute<Route>()
  const navigation = useNavigation<RootNavigationProp>()
  const { t } = useTranslation()
  const { result: address } = useAsync(getSecureItem, ['address'])

  const callback = useCallback(
    async (responseParams: WalletLink.LinkWalletResponse) => {
      try {
        const makerApp = WalletLink.getMakerApp(requestAppId)
        if (!makerApp?.universalLink) return
        const url = `${
          makerApp.universalLink
        }link_wallet/${address}?${qs.stringify(responseParams)}`
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
          Linking.openURL(url)
        }
      } catch (e) {
        console.error(e)
      }

      navigation.goBack()
    },
    [address, navigation, requestAppId],
  )

  const handleLink = useCallback(async () => {
    if (!address) return

    const time = getUnixTime(new Date())
    const token = WalletLink.createWalletLinkToken({
      time,
      address,
      requestAppId,
      signingAppId: getBundleId(),
    })
    await addAppLinkAuthToken(token)
    callback({ token, status: 'success' })
  }, [address, callback, requestAppId])

  const handleCancel = useCallback(async () => {
    callback({ status: 'user_cancelled' })
  }, [callback])

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
