import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../../components/Button'
import Text from '../../../components/Text'

type Props = {
  isFree: boolean
  amount: number
  hasSufficientBalance: boolean
  balance: number
  continuePressed: () => void
}
const HotspotLocationFee = ({
  isFree,
  amount,
  hasSufficientBalance,
  balance,
  continuePressed,
}: Props) => {
  const { t } = useTranslation()
  return (
    <>
      <Text variant="h1" numberOfLines={1} adjustsFontSizeToFit>
        {t('hotspot_setup.location_fee.title')}
      </Text>
      <Text variant="subtitle">{t('hotspot_setup.location_fee.subtitle')}</Text>
      {isFree && (
        <Text variant="body1" marginTop="l">
          {t('hotspot_setup.location_fee.free_title')}
        </Text>
      )}
      {!isFree && (
        <>
          <Text variant="body1" marginTop="l">
            {`amount - ${amount}`}
          </Text>
          <Text variant="body1" marginTop="l">
            {`hasSufficientBalance - ${hasSufficientBalance}`}
          </Text>
          <Text variant="body1" marginTop="l">
            {`balance - ${balance}`}
          </Text>
        </>
      )}

      <Button
        onPress={continuePressed}
        mode="contained"
        variant="secondary"
        title={t('generic.continue')}
        marginTop="l"
      />
    </>
  )
}

export default HotspotLocationFee
