import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native-gesture-handler'
import Radio from '@assets/images/radio.svg'
import RadioSelected from '@assets/images/radio_selected.svg'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'
import TouchableOpacityBox from '../../../../components/TouchableOpacityBox'
import { useColors } from '../../../../theme/themeHooks'

export type DiscoveryLocationOption = 'asserted' | 'hotspot'

type Props = {
  value: DiscoveryLocationOption
  onValueChanged: (value: DiscoveryLocationOption) => void
}
const DiscoveryModeLocationOptions = ({ value, onValueChanged }: Props) => {
  const { t } = useTranslation()
  const { purpleMain } = useColors()
  const data = useMemo(
    () => [
      {
        label: 'discovery.begin.location_opts.asserted',
        value: 'asserted' as DiscoveryLocationOption,
      },
      {
        label: 'discovery.begin.location_opts.hotspot',
        value: 'hotspot' as DiscoveryLocationOption,
      },
    ],
    [],
  )

  const handlePress = useCallback(
    (next: DiscoveryLocationOption) => () => onValueChanged(next),
    [onValueChanged],
  )

  const renderItem = useCallback(
    (props: { index: number }) => {
      const rowData = data[props.index]
      const selected = rowData.value === value
      return (
        <TouchableOpacityBox
          flexDirection="row"
          alignItems="center"
          onPress={handlePress(rowData.value)}
        >
          {selected ? (
            <RadioSelected color={purpleMain} />
          ) : (
            <Radio color={purpleMain} />
          )}
          <Text
            variant="bold"
            fontSize={16}
            lineHeight={27}
            color="black"
            marginLeft="s"
          >
            {t(rowData.label)}
          </Text>
        </TouchableOpacityBox>
      )
    },
    [data, value, handlePress, purpleMain, t],
  )

  return (
    <Box paddingHorizontal="l" marginTop="m">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={({ value: v }) => v}
      />
      <Text variant="body2" color="grayText" marginTop="s">
        {t('discovery.begin.location_opts.info')}
      </Text>
    </Box>
  )
}

export default memo(DiscoveryModeLocationOptions)
