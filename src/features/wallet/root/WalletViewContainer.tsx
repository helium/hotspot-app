import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import BottomSheet from '@gorhom/bottom-sheet'
import Qr from '@assets/images/qr.svg'
import { AnyTransaction, PendingTransaction } from '@helium/http'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import BalanceCard from './BalanceCard/BalanceCard'
import {
  WalletAnimationPoints,
  WalletLayout,
  withWalletLayout,
} from './walletLayout'
import { triggerNavHaptic } from '../../../utils/haptic'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import WalletIntroCarousel from './WalletIntroCarousel'
import { Loading } from '../../../store/activity/activitySlice'
import { ActivityViewState, FilterType } from './walletTypes'
import WalletView from './WalletView'

type Props = {
  layout: WalletLayout
  animationPoints: WalletAnimationPoints
  sendSnapPoints: number[]
  txns: AnyTransaction[]
  pendingTxns: PendingTransaction[]
  filter: FilterType
  txnTypeStatus: Loading
  showSkeleton: boolean
  activityViewState: ActivityViewState
}

const WalletViewContainer = ({
  layout,
  animationPoints,
  sendSnapPoints,
  txns,
  pendingTxns,
  filter,
  txnTypeStatus,
  showSkeleton,
  activityViewState,
}: Props) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const activityCardRef = useRef<BottomSheet>(null)
  const balanceSheetRef = useRef<BottomSheet>(null)

  const [activityCardIndex, setActivityCardIndex] = useState(1)
  const [balanceSheetIndex, setBalanceSheetIndex] = useState(0)

  const navScan = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('Scan')
  }, [navigation])

  const handleSendPress = useCallback(() => {
    triggerNavHaptic()
    navigation.navigate('Send')
  }, [navigation])

  const toggleShowReceive = useCallback(() => {
    if (activityViewState === 'no_activity') {
      const snapToIndex = balanceSheetIndex >= 1 ? 0 : 1
      balanceSheetRef.current?.snapTo(snapToIndex)
    } else {
      const snapToIndex = activityCardIndex >= 1 ? 0 : 1
      activityCardRef.current?.snapTo(snapToIndex)
    }
    triggerNavHaptic()
  }, [activityCardIndex, activityViewState, balanceSheetIndex])

  const containerStyle = useMemo(() => ({ paddingTop: layout.notchHeight }), [
    layout.notchHeight,
  ])

  return (
    <Box flex={1} style={containerStyle}>
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
          {t('wallet.title')}
        </Text>

        <Box flexDirection="row" justifyContent="flex-end">
          <TouchableOpacityBox onPress={navScan} padding="s">
            <Qr width={22} height={22} color="white" />
          </TouchableOpacityBox>
        </Box>
      </Box>

      {(activityViewState === 'activity' ||
        activityViewState === 'undetermined') && (
        <WalletView
          layout={layout}
          animationPoints={animationPoints}
          activityViewState={activityViewState}
          showSkeleton={showSkeleton}
          txns={txns}
          pendingTxns={pendingTxns}
          filter={filter}
          txnTypeStatus={txnTypeStatus}
          setActivityCardIndex={setActivityCardIndex}
          onReceivePress={toggleShowReceive}
          onSendPress={handleSendPress}
          activityCardRef={activityCardRef}
        />
      )}
      {activityViewState === 'no_activity' && (
        <>
          <WalletIntroCarousel />
          <BottomSheet
            index={balanceSheetIndex}
            onChange={setBalanceSheetIndex}
            handleComponent={null}
            backgroundComponent={null}
            snapPoints={sendSnapPoints}
            animateOnMount={false}
            ref={balanceSheetRef}
          >
            <BalanceCard
              layout={layout}
              onReceivePress={toggleShowReceive}
              onSendPress={handleSendPress}
            />
          </BottomSheet>
        </>
      )}
    </Box>
  )
}

export default memo(withWalletLayout(WalletViewContainer))
