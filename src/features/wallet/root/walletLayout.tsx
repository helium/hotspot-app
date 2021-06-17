/* eslint-disable react/jsx-props-no-spreading */
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import React from 'react'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { wh, hp } from '../../../utils/layout'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withWalletLayout = (WrappedComponent: any) => (props: any) => {
  const tabBarHeight = useBottomTabBarHeight()

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => {
        const walletLayout = {
          notchHeight: insets?.top || 0,
          headerHeight: 46,
          chartHeight: hp(25),
          balanceHeight: hp(18),
          qrSendHeight: hp(14),
          balanceInnerTranslate: hp(1),
          altCurrencyHeight: 49,
          navbarHeight: tabBarHeight,
          bottomHeight: insets?.bottom || 1,
          cardHandleHeight: 48,
          sendShareArea: 124,
        }

        const belowStatusBar =
          wh -
          walletLayout.navbarHeight -
          walletLayout.notchHeight -
          walletLayout.bottomHeight -
          (insets?.bottom ? 0 : 48) // hack for differences between react-navigation and react-native-safe-area-context (I think)

        const walletAnimationPoints = {
          dragMax:
            belowStatusBar -
            walletLayout.headerHeight -
            walletLayout.balanceHeight,
          dragMid:
            belowStatusBar -
            walletLayout.headerHeight -
            walletLayout.balanceHeight -
            walletLayout.chartHeight -
            walletLayout.altCurrencyHeight,
          dragMin: walletLayout.bottomHeight - walletLayout.navbarHeight,
        }

        const collapsed =
          walletLayout.balanceHeight - walletLayout.altCurrencyHeight
        const expanded =
          walletLayout.navbarHeight +
          walletLayout.balanceHeight +
          walletLayout.altCurrencyHeight +
          walletLayout.sendShareArea +
          walletLayout.qrSendHeight

        const sendSnapPoints = [collapsed, expanded]

        return (
          <WrappedComponent
            layout={walletLayout}
            animationPoints={walletAnimationPoints}
            sendSnapPoints={sendSnapPoints}
            {...props}
          />
        )
      }}
    </SafeAreaInsetsContext.Consumer>
  )
}

export type WalletAnimationPoints = {
  dragMax: number
  dragMid: number
  dragMin: number
}

export type WalletLayout = {
  notchHeight: number
  headerHeight: number
  chartHeight: number
  balanceHeight: number
  balanceInnerTranslate: number
  altCurrencyHeight: number
  navbarHeight: number
  bottomHeight: number
  qrSendHeight: number
  sendShareArea: number
}
