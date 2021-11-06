import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '../../../../components/Box'
import Text from '../../../../components/Text'

const DiscoveryModeSearching = () => {
  const { t } = useTranslation()
  const [count, setCount] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const nextCount = count + 1
      setCount(nextCount)
      setDots('......'.substring(0, nextCount % 7))
    }, 1000)

    return () => clearInterval(interval)
  }, [count])

  return (
    <Box
      alignSelf="center"
      borderRadius="round"
      backgroundColor="purpleMain"
      height={38}
      width={158}
      paddingHorizontal="m"
      zIndex={9999}
      justifyContent="center"
    >
      <Text variant="regular" fontSize={16}>
        {`${t('discovery.results.searching')}${dots}`}
      </Text>
    </Box>
  )
}

export default memo(DiscoveryModeSearching)
