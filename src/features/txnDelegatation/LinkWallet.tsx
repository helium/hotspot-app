import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { memo, useCallback, useMemo } from 'react'
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
    params: { requestAppId },
  } = useRoute<Route>()
  const navigation = useNavigation<RootNavigationProp>()
  const { t } = useTranslation()
  const { result: address } = useAsync(getSecureItem, ['address'])

  const makerApp = useMemo(() => WalletLink.getMakerApp(requestAppId), [
    requestAppId,
  ])

  const callback = useCallback(
    async (responseParams: WalletLink.LinkWalletResponse) => {
      if (!makerApp?.universalLink || !address) return
      const url = WalletLink.createLinkWalletCallbackUrl(
        makerApp.universalLink,
        address,
        responseParams,
      )
      Linking.openURL(url)

      navigation.goBack()
    },
    [address, makerApp?.universalLink, navigation],
  )

  const handleLink = useCallback(async () => {
    if (!address) return

    const time = getUnixTime(new Date())
    const token = await addAppLinkAuthToken({
      time,
      address,
      requestAppId,
      signingAppId: getBundleId(),
    })
    callback({ token, status: 'success' })
  }, [address, requestAppId, callback])

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
        {t('linkWallet.title', { appName: makerApp?.name })}
      </Text>
      <Text variant="body1" textAlign="center">
        {t('linkWallet.body', { appName: makerApp?.name })}
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
