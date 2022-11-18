/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, memo, useMemo, useState, useCallback } from 'react'
import TextTicker from 'react-native-text-ticker'
import { BoxProps } from '@shopify/restyle'
import { useTranslation } from 'react-i18next'
import { Easing, Linking } from 'react-native'
import {
  fetchStats,
  fetchCurrentOraclePrice,
  fetchPredictedOraclePrice,
} from '../../../store/helium/heliumDataSlice'
import { useAppDispatch } from '../../../store/store'
import { useTextVariants } from '../../../theme/themeHooks'
import { Theme } from '../../../theme/theme'
import useVisible from '../../../utils/useVisible'
import TouchableOpacityBox from '../../../components/TouchableOpacityBox'
import Articles from '../../../constants/articles'

type Props = BoxProps<Theme>
const HotspotsTicker = ({ ...boxProps }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { body2 } = useTextVariants()
  const [lastDataFetch, setLastDataFetch] = useState(0)
  const visible = useVisible()

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

  const onPressTicker = useCallback(() => {
    Linking.openURL(Articles.Wallet_Site)
  }, [])

  return (
    <TouchableOpacityBox {...boxProps} onPress={onPressTicker}>
      <TextTicker
        style={textStyle}
        scrollSpeed={200}
        loop
        repeatSpacer={0}
        easing={Easing.linear}
        maxFontSizeMultiplier={1.2}
      >
        {t('hotspots.migration_ticker')}
      </TextTicker>
    </TouchableOpacityBox>
  )
}

export default memo(HotspotsTicker)
