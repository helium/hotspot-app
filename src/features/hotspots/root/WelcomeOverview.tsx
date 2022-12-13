import { isEqual } from 'lodash'
import React, { useEffect, useState, memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import Balance, { CurrencyType, NetworkTokens } from '@helium/currency'
import { addMinutes, startOfYesterday } from 'date-fns'
import { useAsync } from 'react-async-hook'
import SharedGroupPreferences from 'react-native-shared-group-preferences'
import { Alert, Linking, Platform } from 'react-native'
import Emoji from 'react-native-emoji'
import { useNavigation } from '@react-navigation/native'
import { getWalletApiToken } from '../../../utils/secureAccount'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import useCurrency from '../../../utils/useCurrency'
import HotspotsTicker from './HotspotsTicker'
import animateTransition from '../../../utils/animateTransition'
import { CacheRecord } from '../../../utils/cacheUtils'
import { AccountReward } from '../../../store/account/accountSlice'
import DateModule from '../../../utils/DateModule'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Articles from '../../../constants/articles'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'

const widgetGroup = 'group.com.helium.mobile.wallet.widget'

type Props = { accountRewards: CacheRecord<AccountReward> }
const WelcomeOverview = ({ accountRewards }: Props) => {
  const { t } = useTranslation()
  const { hntBalanceToDisplayVal, toggleConvertHntToCurrency } = useCurrency()
  const [bodyText, setBodyText] = useState('')
  const [{ hotspotsLoaded, validatorsLoaded }, setHasLoadedWelcome] = useState({
    hotspotsLoaded: false,
    validatorsLoaded: false,
  })
  const navigation = useNavigation<RootNavigationProp>()
  const hotspots = useSelector(
    (state: RootState) => state.hotspots.hotspots.data,
    isEqual,
  )

  const hiddenAddresses = useSelector(
    (state: RootState) => state.account.settings.hiddenAddresses,
  )
  const showHiddenHotspots = useSelector(
    (state: RootState) => state.account.settings.showHiddenHotspots,
  )
  const isPinRequired = useSelector(
    (state: RootState) => state.app.isPinRequired,
  )

  const visibleHotspots = useMemo(() => {
    if (showHiddenHotspots) {
      return hotspots
    }
    return hotspots.filter((h) => !hiddenAddresses?.includes(h.address)) || []
  }, [hiddenAddresses, hotspots, showHiddenHotspots])

  const hotspotsLoading = useSelector(
    (state: RootState) => !state.hotspots.hotspotsLoaded,
  )

  const validators = useSelector(
    (state: RootState) => state.validators.validators.data,
    isEqual,
  )
  const validatorsLoading = useSelector(
    (state: RootState) => state.validators.validators.loading,
  )

  const accountAddress = useSelector(
    (state: RootState) => state.account.account?.address,
  )

  const hotspotRewards = useSelector(
    (state: RootState) => state.hotspots.rewards || {},
  )

  const currentOraclePrice = useSelector(
    (state: RootState) => state.heliumData.currentOraclePrice,
  )

  // Hook that is used for helium balance widget.
  useAsync(async () => {
    if (Platform.OS === 'ios') {
      const token = await getWalletApiToken()
      const oraclePrice = currentOraclePrice?.price
      const floatBalance = oraclePrice?.floatBalance

      await SharedGroupPreferences.setItem(
        'myBalanceWidgetKey',
        {
          hntPrice: floatBalance,
          token,
          accountAddress,
        },
        widgetGroup,
      )
    }
  }, [currentOraclePrice, accountAddress])

  // Hook that is used for helium hotspots widget.
  useAsync(async () => {
    if (Platform.OS === 'ios') {
      const token = await getWalletApiToken()
      const rewards: { address: string; reward: Balance<NetworkTokens> }[] = []
      Object.keys(hotspotRewards).forEach((address) => {
        const reward = hotspotRewards[address]
        const rewardObj = {
          address,
          reward,
        }
        rewards.push(rewardObj)
      })
      await SharedGroupPreferences.setItem(
        'myHotspotsWidgetKey',
        { hotspots, rewards, token, accountAddress },
        widgetGroup,
      )
    }
  }, [hotspots, hotspotRewards, accountAddress])

  useEffect(() => {
    if (hotspotsLoaded && validatorsLoaded) return

    const nextLoaded = {
      hotspotsLoaded: hotspotsLoaded || !hotspotsLoading,
      validatorsLoaded: validatorsLoaded || !validatorsLoading,
    }

    if (nextLoaded.hotspotsLoaded && nextLoaded.validatorsLoaded) {
      animateTransition('WelcomeOverview.LoadingChange', {
        enabledOnAndroid: false,
      })
    }

    setHasLoadedWelcome(nextLoaded)
  }, [hotspotsLoaded, hotspotsLoading, validatorsLoaded, validatorsLoading])

  const updateBodyText = useCallback(async () => {
    if (
      !hotspotsLoaded ||
      !validatorsLoaded ||
      accountRewards.loading ||
      accountRewards.total === undefined
    )
      return

    const hntAmount = await hntBalanceToDisplayVal(
      Balance.fromFloat(accountRewards.total, CurrencyType.networkToken),
    )
    const validatorCount = validators.length
    const hotspotCount = visibleHotspots.length
    let nextBodyText = ''
    const yesterday = startOfYesterday()
    const utcOffset = yesterday.getTimezoneOffset()
    const offsetDate = addMinutes(yesterday, utcOffset)
    const date = await DateModule.formatDate(offsetDate.toISOString(), 'MMM d')
    if (validatorCount === 0) {
      nextBodyText = t('hotspots.owned.reward_hotspot_summary', {
        count: hotspotCount,
        hntAmount,
        date,
      })
    } else if (hotspotCount === 0 && validatorCount > 0) {
      nextBodyText = t('hotspots.owned.reward_validator_summary', {
        count: validatorCount,
        hntAmount,
        date,
      })
    } else {
      const validator = t('hotspots.owned.validator', {
        count: validatorCount,
        date,
      })
      const hotspot = t('hotspots.owned.hotspot', {
        count: hotspotCount,
        date,
      })

      nextBodyText = t('hotspots.owned.reward_hotspot_and_validator_summary', {
        hotspot,
        validator,
        hntAmount,
        date,
      })
    }
    setBodyText(nextBodyText)
  }, [
    hotspotsLoaded,
    validatorsLoaded,
    accountRewards.loading,
    accountRewards.total,
    hntBalanceToDisplayVal,
    validators.length,
    visibleHotspots.length,
    t,
  ])

  useEffect(() => {
    updateBodyText()
  }, [updateBodyText])

  const onPressMigrate = useCallback(() => {
    Alert.alert(t('solana.alert.title'), t('solana.alert.message'), [
      {
        text: t('solana.alert.button1'),
        onPress: () => Linking.openURL(Articles.Wallet_Site),
      },
      {
        text: t('solana.alert.button2'),
        onPress: () => {
          if (isPinRequired) {
            navigation.navigate('LockScreen', {
              requestType: 'revealPrivateKey',
            })
          } else {
            navigation.navigate('MainTabs', {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              screen: 'More',
              params: {
                screen: 'RevealPrivateKeyScreen',
              },
            })
          }
        },
      },
      {
        text: t('generic.ok'),
        onPress: () => {},
      },
    ])
  }, [isPinRequired, navigation, t])

  return (
    <Box alignItems="center">
      <HotspotsTicker marginBottom="xl" />
      <Emoji name="wave" style={{ fontSize: 36 }} maxFontSizeMultiplier={1.2} />
      <TouchableOpacityBox onPress={onPressMigrate}>
        <Text
          textAlign="center"
          fontWeight="600"
          fontSize={36}
          color="purpleMain"
          maxFontSizeMultiplier={1}
          adjustsFontSizeToFit
          marginTop="s"
        >
          {t('solana.migrate')}
        </Text>
        <Text
          fontWeight="400"
          fontSize={20}
          lineHeight={24}
          textAlign="center"
          color="black"
          paddingHorizontal="m"
          maxFontSizeMultiplier={1.2}
          marginTop="m"
        >
          {t('solana.migrateMessage')}
        </Text>
      </TouchableOpacityBox>
      <Box marginTop="l" marginBottom="xl">
        {hotspotsLoaded && validatorsLoaded ? (
          <Text
            variant="light"
            fontSize={20}
            lineHeight={24}
            textAlign="center"
            color="black"
            maxFontSizeMultiplier={1.2}
            onPress={toggleConvertHntToCurrency}
          >
            {bodyText}
          </Text>
        ) : (
          <SkeletonPlaceholder speed={3000}>
            <SkeletonPlaceholder.Item
              height={20}
              width={320}
              marginBottom={4}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              alignSelf="center"
              height={20}
              marginBottom={4}
              width={280}
              borderRadius={4}
            />
          </SkeletonPlaceholder>
        )}
      </Box>
    </Box>
  )
}

export default memo(WelcomeOverview)
