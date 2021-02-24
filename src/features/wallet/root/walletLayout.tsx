/* eslint-disable react/jsx-props-no-spreading */
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import React from 'react'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { wh, hp } from '../../../utils/layout'

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
          (walletLayout.navbarHeight +
            walletLayout.cardHandleHeight +
            walletLayout.notchHeight -
            walletLayout.bottomHeight)

        const walletAnimationPoints = {
          dragMax:
            belowStatusBar -
            walletLayout.headerHeight -
            walletLayout.balanceHeight +
            walletLayout.altCurrencyHeight,
          dragMid:
            belowStatusBar -
            walletLayout.headerHeight -
            walletLayout.balanceHeight -
            walletLayout.chartHeight,
          dragMin: walletLayout.bottomHeight,
        }

        const collapsed =
          walletLayout.navbarHeight -
          walletLayout.altCurrencyHeight +
          walletLayout.balanceHeight
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
