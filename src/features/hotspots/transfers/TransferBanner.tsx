import React from 'react'
import animalName from 'angry-purple-tiger'
import Box from '../../../components/Box'
import Text from '../../../components/Text'

type Props = {
  hotspotAddress?: string
  flex?: number
}

const TransferBanner = ({ hotspotAddress, flex }: Props) => {
  return (
    <Box flex={flex} backgroundColor="purple200" padding="m">
      <Text variant="mono" color="blueGrayLight" textAlign="center">
        {hotspotAddress ? animalName(hotspotAddress) : ''}
      </Text>
    </Box>
  )
}

export default TransferBanner
