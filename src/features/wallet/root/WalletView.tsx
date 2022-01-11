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
import {
  HttpPendingTransaction,
  HttpTransaction,
} from '../../../store/activity/activitySlice'

type Props = {
  showSkeleton: boolean
  loadingTxns: boolean
  txns: HttpTransaction[]
  pendingTxns: HttpPendingTransaction[]
}

const WalletView = ({
  showSkeleton,
  txns,
  pendingTxns,
  loadingTxns,
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
  const [balanceInfoSplit, setBalanceInfoSplit] = useState<{
    hasBalance: boolean
    integerPart: string
    decimalPart: string
    phrase: string
  }>({
    hasBalance: false,
    integerPart: '0',
    decimalPart: '00000000',
    phrase: '',
  })
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore bottom sheet type bug https://github.com/gorhom/react-native-bottom-sheet/issues/708
    activityCardRef.current?.snapTo(snapToIndex)
    triggerNavHaptic()
  }, [activityCardIndex, triggerNavHaptic])

  useEffect(() => {
    const updateBalanceInfo = async () => {
      const hasBalance = account?.balance?.integerBalance !== 0
      if (account?.balance && hasBalance) {
        const balInfoSplit = await hntBalanceToDisplayVal(account.balance, true)
        const balInfoPhrase = await hntBalanceToDisplayVal(
          account.balance,
          false,
        )
        const nextBalanceInfoSplit = {
          hasBalance,
          phrase: balInfoPhrase,
          ...balInfoSplit,
        }

        if (isEqual(balanceInfoSplit, nextBalanceInfoSplit)) return
        if (!balanceInfoSplit.hasBalance) {
          // Only animate if they didn't previously have balance info
          animateTransition('WalletView.BalanceInfoUpdated', {
            enabledOnAndroid: false,
          })
        }
        setBalanceInfoSplit(nextBalanceInfoSplit)
      }
    }
    updateBalanceInfo()
  }, [account, balanceInfoSplit, hntBalanceToDisplayVal])

  useEffect(() => {
    const noResults =
      !showSkeleton && pendingTxns.length === 0 && txns.length === 0
    setHasNoResults(noResults)
  }, [pendingTxns.length, showSkeleton, txns.length])

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

  return (
    <>
      <Animated.View style={condensedHeaderStyle}>
        <WalletHeaderCondensed
          onReceivePress={toggleShowReceive}
          onSendPress={handleSendPress}
          onLayout={handleLayout('condensedHeader')}
          balance={balanceInfoSplit}
        />
      </Animated.View>
      <Box flex={1}>
        <Box onLayout={handleLayout('header')}>
          <WalletHeader handleScanPressed={navScan} />
          <BalanceCard
            onReceivePress={toggleShowReceive}
            onSendPress={handleSendPress}
            balanceInfo={balanceInfoSplit}
            account={account}
            accountLoading={
              fetchAccountState !== 'fulfilled' && !balanceInfoSplit.hasBalance
            }
            toggleConvertHntToCurrency={toggleConvertHntToCurrency}
          />
        </Box>
        <WalletAddress flex={1} alignItems="center" justifyContent="center" />
      </Box>
      <ActivityCard
        ref={activityCardRef}
        showSkeleton={showSkeleton}
        filter={filter}
        txns={txns}
        loadingTxns={loadingTxns}
        pendingTxns={pendingTxns}
        hasNoResults={hasNoResults}
        paddingVertical={listTopPadding.key}
        snapPoints={snapPoints}
        animatedIndex={animatedCardIndex}
        onChange={setActivityCardIndex}
      />
    </>
  )
}

export default memo(WalletView)
