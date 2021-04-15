import React, { memo, useCallback } from 'react'
import Box from './Box'
import SegmentedControlItem from './SegmentedControlItem'

type Props = {
  values: string[]
  selectedIndex: number
  onChange: (index: number) => void
}
const SegmentedControl = ({ values, selectedIndex, onChange }: Props) => {
  const handlePress = useCallback(
    (index: number) => () => {
      onChange(index)
    },
    [onChange],
  )

  return (
    <Box height={32} flexDirection="row">
      {values.map((v, index) => (
        <SegmentedControlItem
          key={v}
          onChange={handlePress(index)}
          isFirst={index === 0}
          isLast={index === values.length - 1}
          selected={index === selectedIndex}
          title={v}
        />
      ))}
    </Box>
  )
}

export default memo(SegmentedControl)
