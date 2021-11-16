/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, memo, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import TextTicker from 'react-native-text-ticker'
import { BoxProps } from '@shopify/restyle'
import { useTranslation } from 'react-i18next'
import { Easing } from 'react-native'
import { isTablet } from 'react-native-device-info'
import Box from '../../../components/Box'
import {
  fetchStats,
  fetchCurrentOraclePrice,
  fetchPredictedOraclePrice,
} from '../../../store/helium/heliumDataSlice'
import { RootState } from '../../../store/rootReducer'
import { useAppDispatch } from '../../../store/store'
import { useTextVariants } from '../../../theme/themeHooks'
import { Theme } from '../../../theme/theme'
import { locale } from '../../../utils/i18n'
import useVisible from '../../../utils/useVisible'

type Props = BoxProps<Theme>
const HotspotsTicker = ({ ...boxProps }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { body2 } = useTextVariants()
  const [lastDataFetch, setLastDataFetch] = useState(0)
  const visible = useVisible()

  const currentOraclePrice = useSelector(
    (state: RootState) => state.heliumData.currentOraclePrice,
  )
  const hotspotCount = useSelector(
    (state: RootState) => state.heliumData.hotspotCount,
  )
  const blockTime = useSelector(
    (state: RootState) => state.heliumData.blockTime,
  )

  useEffect(() => {
    if (!visible && lastDataFetch !== 0) return

    const nowInSec = Date.now() / 1000
    const refreshTime = 300 // 5 mins

    if (nowInSec - refreshTime < lastDataFetch) return

    setLastDataFetch(nowInSec)
    dispatch(fetchCurrentOraclePrice())
    dispatch(fetchPredictedOraclePrice())
    dispatch(fetchStats())
  }, [dispatch, lastDataFetch, visible])

  const textStyle = useMemo(
    () => ({ ...body2, fontSize: 16, color: '#AEB0D8' }),
    [body2],
  )

  const text = useMemo(() => {
    const formattedHotspotCount = hotspotCount?.toLocaleString(locale)
    const oraclePrice = currentOraclePrice?.price
    const formattedBlockTime = blockTime?.toLocaleString(locale, {
      maximumFractionDigits: 0,
    })
    const opts = {
      formattedHotspotCount,
      oraclePrice: oraclePrice?.floatBalance,
      formattedBlockTime,
    }
    if (blockTime && formattedHotspotCount) {
      return t('hotspots.ticker', opts)
    }
    if (blockTime) {
      return t('hotspots.ticker_no_hotspots', opts)
    }
    if (formattedHotspotCount) {
      return t('hotspots.ticker_no_block', opts)
    }

    return t('hotspots.ticker_no_hotspots_or_block', opts)
  }, [blockTime, currentOraclePrice?.price, hotspotCount, t])

  return (
    <Box {...boxProps}>
      <TextTicker
        style={textStyle}
        scrollSpeed={200}
        loop
        repeatSpacer={0}
        easing={Easing.linear}
      >
        {isTablet() ? text + text : text}
      </TextTicker>
    </Box>
  )
}

export default memo(HotspotsTicker)
