import React from 'react'
import { useTranslation } from 'react-i18next'
import Text from '../../../components/Text'

const HotspotLocationFeePending = () => {
  const { t } = useTranslation()
  return (
    <>
      <Text variant="header" numberOfLines={1} adjustsFontSizeToFit>
        {t('hotspot_setup.location_fee.title')}
      </Text>
      <Text variant="body1Light" marginTop="l">
        {t('hotspot_setup.location_fee.pending_p_1')}
      </Text>
      <Text variant="body1Light" marginTop="l">
        {t('hotspot_setup.location_fee.pending_p_2')}
      </Text>
    </>
  )
}

export default HotspotLocationFeePending
