/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { BoxProps } from '@shopify/restyle'
import { formatDistance } from 'date-fns'
import { Theme } from '../theme/theme'
import Card from './Card'
import Text from './Text'

type Props = { children: React.ReactNode; date: Date } & BoxProps<Theme>

const Notification = ({ children, date, ...props }: Props) => {
  return (
    <Card
      variant="elevated"
      backgroundColor="white"
      paddingHorizontal="m"
      paddingVertical="s"
      {...props}
    >
      <Text variant="bodyBold" color="black">
        {children}
      </Text>
      <Text variant="bodyMono" fontSize={12} color="lighterGray">
        {formatDistance(date, new Date(), {
          addSuffix: true,
        })}
      </Text>
    </Card>
  )
}

export default Notification
