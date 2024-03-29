import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { memo, useCallback } from 'react'
import { useAsync } from 'react-async-hook'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'
import { getBundleId } from 'react-native-device-info'
import AppLinkIcon from '@assets/images/appLink.svg'
import {
  createLinkWalletCallbackUrl,
  LinkWalletResponse,
} from '@helium/wallet-link'
import SafeAreaBox from '../../components/SafeAreaBox'
import Text from '../../components/Text'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import {
  RootNavigationProp,
  RootStackParamList,
} from '../../navigation/main/tabTypes'
import { createLinkToken, getSecureItem } from '../../utils/secureAccount'

type Route = RouteProp<RootStackParamList, 'LinkWallet'>
const LinkWallet = () => {
  const {
    params: { requestAppId, callbackUrl, appName },
  } = useRoute<Route>()
  const navigation = useNavigation<RootNavigationProp>()
  const { t } = useTranslation()
  const { result: address } = useAsync(getSecureItem, ['address'])

  const callback = useCallback(
    async (responseParams: LinkWalletResponse) => {
      if (!address) return

      const url = createLinkWalletCallbackUrl(
        callbackUrl,
        address,
        responseParams,
      )
      Linking.openURL(url)

      navigation.goBack()
    },
    [address, callbackUrl, navigation],
  )

  const handleLink = useCallback(async () => {
    if (!address) return

    const token = await createLinkToken({
      address,
      requestAppId,
      signingAppId: getBundleId(),
      callbackUrl,
      appName,
    })
    callback({ token, status: 'success' })
  }, [address, requestAppId, callbackUrl, appName, callback])

  const handleCancel = useCallback(async () => {
    callback({ status: 'user_cancelled' })
  }, [callback])

  return (
    <SafeAreaBox
      backgroundColor="primaryBackground"
      flex={1}
      padding="l"
      justifyContent="center"
    >
      <AppLinkIcon />

      <Text variant="bold" fontSize={32} marginTop="m">
        {t('linkWallet.title', { appName })}
      </Text>
      <Text variant="body1" color="purpleLightText" marginVertical="m">
        {t('linkWallet.body', { appName })}
      </Text>
      <TouchableOpacityBox
        marginTop="ms"
        minHeight={56}
        justifyContent="center"
        backgroundColor="greenBright"
        borderRadius="l"
        onPress={handleLink}
      >
        <Text
          variant="medium"
          fontSize={16}
          color="primaryBackground"
          textAlign="center"
        >
          {t('linkWallet.yes')}
        </Text>
      </TouchableOpacityBox>

      <TouchableOpacityBox
        minHeight={56}
        justifyContent="center"
        backgroundColor="purpleDull"
        marginTop="ms"
        borderRadius="l"
        onPress={handleCancel}
      >
        <Text variant="medium" fontSize={16} color="white" textAlign="center">
          {t('linkWallet.no')}
        </Text>
      </TouchableOpacityBox>
    </SafeAreaBox>
  )
}

export default memo(LinkWallet)
