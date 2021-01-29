import React from 'react'
import { Hotspot } from '@helium/http'
import animalName from 'angry-purple-tiger'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

type Props = {
  hotspot?: Hotspot
  flex?: number
}

const TransferBanner = ({ hotspot, flex }: Props) => {
  return (
    <Box flex={flex} backgroundColor="purple200" padding="m">
      <Text variant="mono" color="blueGrayLight" textAlign="center">
        {hotspot ? animalName(hotspot.address) : ''}
      </Text>
    </Box>
  )
}

export default TransferBanner
