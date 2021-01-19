import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import animalHash from 'angry-purple-tiger'
import Box from '../../../components/Box'
import Text from '../../../components/Text'
import { RootState } from '../../../store/rootReducer'
import Card from '../../../components/Card'
import NotConnected from '../../../assets/images/notConnected.svg'
import Paired from '../../../assets/images/paired.svg'
import { useColors } from '../../../theme/themeHooks'

const WifiSettings = () => {
  const [networkStatus, setNetworkStatus] = useState<
    'ethernet' | 'wifi' | 'notConnected'
  >('notConnected')
  const {
    connectedHotspot: { address, ethernetOnline, wifi },
  } = useSelector((state: RootState) => state)
  const { greenBright } = useColors()

  useEffect(() => {
    if (ethernetOnline) {
      setNetworkStatus('ethernet')
      return
    }

    if (wifi) {
      setNetworkStatus('wifi')
      return
    }

    setNetworkStatus('notConnected')
  }, [ethernetOnline, wifi])

  const { t } = useTranslation()
  return (
    <Box padding="l" minHeight={413}>
      <Text variant="medium" fontSize={21} color="black" marginBottom="lx">
        {animalHash(address || '')}
      </Text>

      <Text variant="medium" fontSize={15} color="black" marginBottom="m">
        {t('hotspot_settings.wifi.connected_via')}
      </Text>

      <Card
        variant="regular"
        flexDirection="row"
        height={49}
        alignItems="center"
      >
        <Text
          variant="medium"
          fontSize={15}
          color={networkStatus === 'notConnected' ? 'grayMain' : 'black'}
          flex={1}
        >
          {networkStatus === 'ethernet' && t('hotspot_settings.wifi.ethernet')}
          {networkStatus === 'wifi' && wifi}
          {networkStatus === 'notConnected' &&
            t('hotspot_settings.wifi.not_connected')}
        </Text>

        {networkStatus === 'notConnected' && <NotConnected />}
        {networkStatus !== 'notConnected' && (
          <Paired color={greenBright} height={18} width={18} />
        )}
      </Card>
    </Box>
  )
}

export default WifiSettings
