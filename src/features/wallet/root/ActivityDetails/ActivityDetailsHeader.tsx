import React, { useMemo } from 'react'
import Handle from '@assets/images/handle.svg'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'

type Props = {
  backgroundColor: string
  title: string
  date: string
  icon: React.ReactNode
}
const ActivityDetailsHeader = ({
  backgroundColor,
  title,
  icon,
  date,
}: Props) => {
  const containerStyle = useMemo(
    () => ({
      backgroundColor,
    }),
    [backgroundColor],
  )

  return (
    <Box
      height={143}
      paddingHorizontal="l"
      padding="m"
      style={containerStyle}
      borderTopRightRadius="m"
      borderTopLeftRadius="m"
    >
      <Box alignItems="center">
        <Handle />
      </Box>
      <Box justifyContent="space-between" flex={1}>
        {icon}
        <Text
          variant="medium"
          fontSize={28}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {title}
        </Text>
        <Text variant="light" fontSize={15} paddingBottom="ms">
          {date}
        </Text>
      </Box>
    </Box>
  )
}

export default ActivityDetailsHeader
