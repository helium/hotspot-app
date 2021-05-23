import React, { useCallback } from 'react'
import { BoxProps } from '@shopify/restyle'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Font, Theme } from '../../../theme/theme'
import { HeliumActionSheetItemHeight } from '../../../components/HeliumActionSheetItem'
import appSlice from '../../../store/user/appSlice'
import { useAppDispatch } from '../../../store/store'
import Text from '../../../components/Text'
import HeliumBottomSheet from '../../../components/HeliumBottomSheet'

type Props = BoxProps<Theme> & {
  isVisible: boolean
  onClose?: () => void
}

const DeploymentModeModal = ({ isVisible, onClose = () => {} }: Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const insets = useSafeAreaInsets()

  const sheetHeight = HeliumActionSheetItemHeight + 176 + (insets?.bottom || 0)
  const enableDeploymentMode = useCallback(() => {
    dispatch(appSlice.actions.enableDeploymentMode(true))
    onClose()
  }, [dispatch, onClose])

  const modalBody = (
    <>
      <Text>{t('more.sections.security.deploymentMode.description')}</Text>
      <Text marginTop="m" fontFamily={Font.main.semiBold}>
        {t('more.sections.security.deploymentMode.warning')}
      </Text>
    </>
  )

  return (
    <HeliumBottomSheet
      body={modalBody}
      confirmText={t('generic.submit')}
      isVisible={isVisible}
      onConfirm={enableDeploymentMode}
      onClose={onClose}
      sheetHeight={sheetHeight}
      title={t('more.sections.security.deploymentMode.title')}
    />
  )
}

export default DeploymentModeModal
