import React, {
  memo,
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from 'react'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import {
  useSafeAreaInsets,
  useSafeAreaFrame,
} from 'react-native-safe-area-context'
import { LayoutChangeEvent } from 'react-native'
import { isEqual } from 'lodash'
import { useSelector } from 'react-redux'
import BottomSheet from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native'
import ActivityCard from './ActivityCard/ActivityCard'
import { ActivityViewState } from './walletTypes'
import { Spacing } from '../../../theme/theme'
import { useSpacing } from '../../../theme/themeHooks'
import Box from '../../../components/Box'
import { RootState } from '../../../store/rootReducer'
import useCurrency from '../../../utils/useCurrency'
import BalanceCard from './BalanceCard/BalanceCard'
import WalletAddress from './WalletAddress'
import WalletHeader from './WalletHeader'
import WalletHeaderCondensed from './WalletHeaderCondensed'
import animateTransition from '../../../utils/animateTransition'
import { RootNavigationProp } from '../../../navigation/main/tabTypes'
import useHaptic from '../../../utils/useHaptic'
import WalletEmpty from './WalletEmpty'

type Props = {
  showSkeleton: boolean
  activityViewState: ActivityViewState
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
}

const WalletView = ({
  showSkeleton,
  activityViewState,
  txns,
  pendingTxns,
}: Props) => {
  const animatedCardIndex = useSharedValue<number>(1)
  const [hasNoResults, setHasNoResults] = useState(false)
  const [viewHeights, setViewHeights] = useState({
    header: { hasLayout: false, value: 230 },
    condensedHeader: { hasLayout: false, value: 90 },
  })
  const tabBarHeight = useBottomTabBarHeight()
  const insets = useSafeAreaInsets()
  const { height } = useSafeAreaFrame()
  const spacing = useSpacing()
  const [balanceInfo, setBalanceInfo] = useState<{
    hasBalance: boolean
    integerPart: string
    decimalPart: string
  }>({ hasBalance: false, integerPart: '0', decimalPart: '00000000' })
  const navigation = useNavigation<RootNavigationProp>()
  const { triggerNavHaptic } = useHaptic()
  const activityCardRef = useRef<BottomSheet>(null)
  const [activityCardIndex, setActivityCardIndex] = useState(1)
  const { hntBalanceToDisplayVal, toggleConvertHntToCurrency } = useCurrency()

  const account = useSelector(
    (state: RootState) => state.account.account,
    isEqual,
  )
  const fetchAccountState = useSelector(
    (state: RootState) => state.account.fetchDataStatus,
    isEqual,
  )
  const filter = useSelector((state: RootState) => state.activity.filter)

  const navScan = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('ScanStack')
  }, [navigation, triggerNavHaptic])

  const handleSendPress = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('SendStack')
  }, [navigation, triggerNavHaptic])

  const toggleShowReceive = useCallback(() => {
    const snapToIndex = activityCardIndex >= 1 ? 0 : 1
    activityCardRef.current?.snapTo(snapToIndex)
    triggerNavHaptic()
  }, [activityCardIndex, triggerNavHaptic])

  useEffect(() => {
    const updateBalanceInfo = async () => {
      const hasBalance = account?.balance?.integerBalance !== 0
      if (account?.balance && hasBalance) {
        const balInfo = await hntBalanceToDisplayVal(account.balance, true)
        const nextBalanceInfo = {
          hasBalance,
          ...balInfo,
        }
        if (isEqual(balanceInfo, nextBalanceInfo)) return
        animateTransition('WalletView.BalanceInfoUpdated', {
          enabledOnAndroid: false,
        })
        setBalanceInfo(nextBalanceInfo)
      }
    }
    updateBalanceInfo()
  }, [account, balanceInfo, hntBalanceToDisplayVal])

  useEffect(() => {
    const noResults =
      activityViewState === 'activity' &&
      !showSkeleton &&
      pendingTxns.length === 0 &&
      txns.length === 0
    setHasNoResults(noResults)
  }, [activityViewState, pendingTxns.length, showSkeleton, txns.length])

  const condensedHeaderStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      left: 0,
      right: 0,
      opacity: animatedCardIndex.value - 1,
      top: 0,
      zIndex: 9999,
      transform: [
        {
          translateY: interpolate(
            animatedCardIndex.value,
            [1, 2],
            [0, insets.top],
            Extrapolate.CLAMP,
          ),
        },
      ],
    }),
    [animatedCardIndex],
  )

  const handleLayout = useCallback(
    (key: 'condensedHeader' | 'header') => (event: LayoutChangeEvent) => {
      const nextViewHeights = {
        ...viewHeights,
        [key]: { value: event?.nativeEvent.layout.height, hasLayout: true },
      }

      if (
        nextViewHeights.condensedHeader.hasLayout &&
        nextViewHeights.header.hasLayout
      ) {
        // We only want to call this once
        animateTransition('WalletView.HeaderLayoutFinished')
      }

      setViewHeights(nextViewHeights)
    },
    [viewHeights],
  )

  const listTopPadding = useMemo(() => {
    const spacingKey = 'l' as Spacing
    return { key: spacingKey, value: spacing[spacingKey] }
  }, [spacing])

  const snapPoints = useMemo(() => {
    const collapsedHeight = listTopPadding.value
    const belowStatusBar = height - tabBarHeight - insets.top
    const midHeight = belowStatusBar - viewHeights.header.value
    const expandedHeight = belowStatusBar - viewHeights.condensedHeader.value

    return [collapsedHeight, midHeight, expandedHeight]
  }, [
    height,
    insets.top,
    listTopPadding.value,
    tabBarHeight,
    viewHeights.condensedHeader.value,
    viewHeights.header.value,
  ])

  const loading = useMemo(() => activityViewState === 'undetermined', [
    activityViewState,
  ])

  return (
    <>
      <Animated.View style={condensedHeaderStyle}>
        <WalletHeaderCondensed
          onReceivePress={toggleShowReceive}
          onSendPress={handleSendPress}
          onLayout={handleLayout('condensedHeader')}
          balance={balanceInfo}
        />
      </Animated.View>
      <Box flex={1}>
        {activityViewState === 'activity' && (
          <Box onLayout={handleLayout('header')}>
            <WalletHeader
              handleScanPressed={navScan}
              opacity={loading ? 0 : 1}
            />
            <BalanceCard
              opacity={loading ? 0 : 1}
              onReceivePress={toggleShowReceive}
              onSendPress={handleSendPress}
              balanceInfo={balanceInfo}
              account={account}
              accountLoading={
                fetchAccountState === 'idle' || fetchAccountState === 'rejected'
              }
              toggleConvertHntToCurrency={toggleConvertHntToCurrency}
            />
          </Box>
        )}
        {activityViewState === 'no_activity' && <WalletEmpty />}
        <WalletAddress
          flex={1}
          alignItems="center"
          justifyContent={
            activityViewState === 'no_activity' ? 'flex-start' : 'center'
          }
        />
      </Box>

      {activityViewState === 'activity' && (
        <ActivityCard
          ref={activityCardRef}
          showSkeleton={showSkeleton}
          filter={filter}
          txns={txns}
          pendingTxns={pendingTxns}
          hasNoResults={hasNoResults}
          paddingVertical={listTopPadding.key}
          snapPoints={snapPoints}
          animatedIndex={animatedCardIndex}
          onChange={setActivityCardIndex}
        />
      )}
    </>
  )
}

export default memo(WalletView)
