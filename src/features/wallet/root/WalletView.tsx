import React, { useRef, memo, useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Animated, { Extrapolate, useValue } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import BottomSheet from '@gorhom/bottom-sheet'
import Search from '@assets/images/search.svg'
import Qr from '@assets/images/qr.svg'
import { useSelector } from 'react-redux'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import BarChart from '../../../components/BarChart'
import BalanceCard from './BalanceCard/BalanceCard'
import ActivityCard from './ActivityCard/ActivityCard'
import {
  withWalletLayout,
  WalletAnimationPoints,
  WalletLayout,
} from './walletLayout'
import { triggerNavHaptic } from '../../../utils/haptic'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import { RootState } from '../../../store/rootReducer'
import { hp } from '../../../utils/layout'
import WalletIntroCarousel from './WalletIntroCarousel'

type Props = {
  layout: WalletLayout
  animationPoints: WalletAnimationPoints
}

const WalletView = ({ layout, animationPoints }: Props) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    activity: { txns },
  } = useSelector((state: RootState) => state)
  const hasActivity = txns.all.data.length !== 0

  const activityCard = useRef<BottomSheet>(null)
  const balanceSheet = useRef<BottomSheet>(null)

  const [activityCardIndex, setActivityCardIndex] = useState(1)
  const [balanceSheetIndex, setBalanceSheetIndex] = useState(0)
  const animatedCardIndex = useValue(1)

  const handlePress = useCallback(() => {
    triggerNavHaptic()
  }, [])

  const navScan = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('Scan')
  }, [navigation])

  const handleSendPress = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('Send')
  }, [navigation])

  const toggleShowReceive = useCallback(() => {
    if (hasActivity) {
      const snapToIndex = activityCardIndex === 1 ? 0 : 1
      activityCard.current?.snapTo(snapToIndex)
    } else {
      const snapToIndex = balanceSheetIndex === 1 ? 0 : 1
      balanceSheet.current?.snapTo(snapToIndex)
    }
    triggerNavHaptic()
  }, [activityCardIndex, balanceSheetIndex, hasActivity])

  const balanceCardStyles = useMemo(
    () => [
      {
        flex: 1,
      },
      {
        transform: [
          {
            translateY: animatedCardIndex.interpolate({
              inputRange: [1, 2],
              outputRange: [0, -layout.chartHeight],
              extrapolate: Extrapolate.CLAMP,
            }),
          },
        ],
      },
    ],
    [animatedCardIndex, layout.chartHeight],
  )

  return (
    <Box flex={1} style={{ paddingTop: layout.notchHeight }}>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="l"
        backgroundColor="primaryBackground"
        zIndex={1}
        height={layout.headerHeight}
      >
        <Text variant="h1" fontSize={22}>
          {hasActivity ? t('wallet.title') : ' '}
        </Text>

        <Box flexDirection="row" justifyContent="space-between" width={85}>
          <TouchableOpacityBox onPress={handlePress} padding="s">
            <Search width={22} height={22} />
          </TouchableOpacityBox>
          <TouchableOpacityBox onPress={navScan} padding="s">
            <Qr width={22} height={22} color="white" />
          </TouchableOpacityBox>
        </Box>
      </Box>

      {hasActivity ? (
        <>
          <Box paddingHorizontal="l">
            <BarChart height={layout.chartHeight} />
          </Box>
          <Animated.View style={balanceCardStyles}>
            <BalanceCard
              onReceivePress={toggleShowReceive}
              onSendPress={handleSendPress}
            />
          </Animated.View>

          <ActivityCard
            ref={activityCard}
            animationPoints={animationPoints}
            animatedIndex={animatedCardIndex}
            onChange={setActivityCardIndex}
          />
        </>
      ) : (
        <>
          <WalletIntroCarousel />
          <BottomSheet
            index={balanceSheetIndex}
            onChange={setBalanceSheetIndex}
            handleComponent={null}
            backgroundComponent={null}
            snapPoints={[hp(20), hp(55)]}
            animateOnMount={false}
            ref={balanceSheet}
          >
            <BalanceCard
              onReceivePress={toggleShowReceive}
              onSendPress={handleSendPress}
            />
          </BottomSheet>
        </>
      )}
    </Box>
  )
}

export default memo(withWalletLayout(WalletView))
