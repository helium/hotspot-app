import StaticSafeAreaInsets from 'react-native-static-safe-area-insets'
import { wh, hp } from '../../../utils/layout'

export const walletLayout = {
  notchHeight: StaticSafeAreaInsets.safeAreaInsetsTop,
  headerHeight: 46,
  chartHeight: hp(25),
  balanceHeight: hp(18),
  balanceInnerTranslate: hp(1),
  altCurrencyHeight: 60,
  navbarHeight: 49,
  bottomHeight: StaticSafeAreaInsets.safeAreaInsetsBottom,
}

export const walletAnimationPoints = {
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

export type WalletAnimationPoints = {
  dragMax: number
  dragMid: number
  dragMin: number
}
