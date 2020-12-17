import React from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../../components/Text'

const HotspotSetupScanWifiError = () => {
  const { t } = useTranslation()
  return (
    <>
      <Text variant="h1">{t('hotspot_setup.wifi_scan.title')}</Text>
      <Text variant="subtitleMedium" marginVertical="l">
        {t('hotspot_setup.wifi_scan.scan_fail_subtitle')}
      </Text>
    </>
  )
}

export default HotspotSetupScanWifiError
