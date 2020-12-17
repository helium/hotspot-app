import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'
import Button from '../../../components/Button'
import Text from '../../../components/Text'
import useAlert from '../../../utils/useAlert'

type Props = {
  configuredNetwork?: string
  networks?: string[] | null
  removeConfiguredNetwork: () => void
  connectNetwork: (network: string) => void
  continueWithWifi: () => void
  disabled: boolean
}
const HotspotSetupScanWifiSuccess = ({
  networks,
  configuredNetwork,
  removeConfiguredNetwork,
  connectNetwork,
  continueWithWifi,
  disabled,
}: Props) => {
  const { t } = useTranslation()
  const { showOKCancelAlert } = useAlert()

  const forgetNetwork = async () => {
    if (!configuredNetwork) return
    const decision = await showOKCancelAlert({
      titleKey: 'hotspot_setup.disconnect_dialog.title',
      messageKey: 'hotspot_setup.disconnect_dialog.body',
      messageOptions: { wifiName: configuredNetwork },
      okKey: 'generic.forget',
    })
    if (decision) removeConfiguredNetwork()
  }

  return (
    <>
      <Text variant="h1" marginBottom="l">
        {t('hotspot_setup.wifi_scan.settings_title')}
      </Text>

      <Text variant="body1">
        {t(
          configuredNetwork
            ? 'hotspot_setup.wifi_scan.saved_networks'
            : 'hotspot_setup.wifi_scan.available_networks',
        )}
      </Text>

      {configuredNetwork && (
        <>
          <Text variant="subtitleBold">{configuredNetwork}</Text>
          <Button
            disabled={disabled}
            marginTop="l"
            mode="contained"
            title={t('hotspot_setup.wifi_scan.disconnect')}
            onPress={forgetNetwork}
          />
        </>
      )}

      {!configuredNetwork && (
        <FlatList
          data={networks}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Button
              disabled={disabled}
              key={item}
              variant="secondary"
              mode="contained"
              title={item}
              marginTop="m"
              onPress={() => connectNetwork(item)}
            />
          )}
        />
      )}
      {configuredNetwork && (
        <Button
          disabled={disabled}
          mode="contained"
          marginTop="l"
          onPress={continueWithWifi}
          variant="secondary"
          title={t('generic.continue')}
        />
      )}
    </>
  )
}

export default HotspotSetupScanWifiSuccess
