import { Validator } from '@helium/http'
import React, { memo, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import Box from '../../components/Box'
import Text from '../../components/Text'
import { RootState } from '../../store/rootReducer'
import { Colors } from '../../theme/theme'
import { locale } from '../../utils/i18n'

export type ValidatorPenalty = {
  type: 'performance' | 'tenure'
  height: number
  amount: number
}
type Props = { validator?: Validator }
const ValidatorDetailsPenalties = ({ validator }: Props) => {
  const { t, i18n } = useTranslation()

  const blockHeight = useSelector(
    (state: RootState) => state.heliumData.blockHeight,
  )

  type PenaltyItem = { index: number; item: ValidatorPenalty }
  const renderItem = useCallback(
    ({ index, item }: PenaltyItem) => {
      let title = t('validator_details.penalty')
      const key = `validator_details.${item.type}`
      if (i18n.exists(key)) {
        title = t(key)
      }
      const isFirst = index === 0
      const isLast =
        validator?.penalties?.length && index === validator.penalties.length - 1
      const backgroundColor = () => {
        switch (item.type) {
          case 'tenure':
            return 'redLight' as Colors
          case 'performance':
            return 'redMain' as Colors
          default:
            return 'black' as Colors
        }
      }
      return (
        <Box
          flexDirection="row"
          backgroundColor="grayPurpleLight"
          marginBottom="xxxs"
          borderTopLeftRadius={isFirst ? 'm' : 'none'}
          borderTopRightRadius={isFirst ? 'm' : 'none'}
          borderBottomLeftRadius={isLast ? 'm' : 'none'}
          borderBottomRightRadius={isLast ? 'm' : 'none'}
          padding="m"
          alignItems="center"
        >
          <Box flex={1}>
            <Box flexDirection="row" alignItems="center">
              <Box
                borderRadius="round"
                height={11}
                width={11}
                backgroundColor={backgroundColor()}
                marginRight="xs"
              />
              <Text color="purpleMediumText" variant="medium" fontSize={15}>
                {title}
              </Text>
            </Box>

            <Text color="purpleMediumText" variant="regular" fontSize={13}>
              {t('validator_details.block', {
                height: item.height.toLocaleString(locale),
              })}
            </Text>
          </Box>
          <Text variant="medium" color="grayDarkText" fontSize={15}>
            {item.amount.toLocaleString(locale, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 1,
            })}
          </Text>
        </Box>
      )
    },
    [i18n, t, validator],
  )

  const keyExtractor = useCallback((item) => {
    const { height, type } = item as ValidatorPenalty
    return `${height}.${type}`
  }, [])

  const contentContainerStyle = useMemo(() => ({ paddingBottom: 32 }), [])

  return (
    <Box flex={1}>
      <Text
        variant="medium"
        fontSize={15}
        color="grayLightText"
        marginLeft="s"
        marginVertical="ms"
      >
        {t('validator_details.current_block_height', { blockHeight })}
      </Text>

      <FlatList
        data={validator?.penalties || []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
      />
    </Box>
  )
}

export default memo(ValidatorDetailsPenalties)
