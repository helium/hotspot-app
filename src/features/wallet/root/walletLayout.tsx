/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { wh, hp } from '../../../utils/layout'

export const withWalletLayout = (WrappedComponent: any) => (props: any) => {
  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => {
        const walletLayout = {
          notchHeight: insets?.top || 0,
          headerHeight: 46,
          chartHeight: hp(25),
          balanceHeight: hp(18),
          balanceInnerTranslate: hp(1),
          altCurrencyHeight: 60,
          navbarHeight: 49,
          bottomHeight: insets?.bottom || 0,
        }

        const walletAnimationPoints = {
          dragMax:
            wh -
            walletLayout.notchHeight -
            walletLayout.bottomHeight -
            walletLayout.navbarHeight -
            walletLayout.headerHeight -
            walletLayout.balanceHeight +
            walletLayout.altCurrencyHeight,
          dragMid:
            wh -
            walletLayout.notchHeight -
            walletLayout.bottomHeight -
            walletLayout.navbarHeight -
            walletLayout.headerHeight -
            walletLayout.chartHeight -
            walletLayout.balanceHeight,
          dragMin: 40,
        }
        return (
          <WrappedComponent
            layout={walletLayout}
            animationPoints={walletAnimationPoints}
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
}
