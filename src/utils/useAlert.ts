import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

const useAlert = () => {
  const { t } = useTranslation()

  const showOKAlert = useCallback(
    (options: {
      titleKey: string
      messageKey?: string
      messageOptions?: Record<string, string>
      okKey?: string
    }): Promise<boolean> =>
      new Promise((resolve) => {
        const { titleKey, messageKey, messageOptions, okKey } = options
        const title = t(titleKey)
        const message = messageKey ? t(messageKey, messageOptions) : undefined
        Alert.alert(title, message, [
          {
            text: t(okKey || 'generic.ok'),
            onPress: () => resolve(true),
          },
        ])
      }),
    [t],
  )

  const showOKCancelAlert = useCallback(
    (options: {
      titleKey: string
      messageKey?: string
      messageOptions?: Record<string, string>
      okKey?: string
      cancelKey?: string
      cancelStyle?: 'destructive' | 'cancel'
    }): Promise<boolean> =>
      new Promise((resolve) => {
        const {
          titleKey,
          messageKey,
          messageOptions,
          okKey,
          cancelKey,
          cancelStyle = 'destructive',
        } = options
        const title = t(titleKey)
        const message = messageKey ? t(messageKey, messageOptions) : undefined
        Alert.alert(title, message, [
          {
            text: t(cancelKey || 'generic.cancel'),
            style: cancelStyle,
            onPress: () => resolve(false),
          },
          {
            text: t(okKey || 'generic.ok'),
            onPress: () => resolve(true),
          },
        ])
      }),
    [t],
  )

  return { showOKCancelAlert, showOKAlert }
}

export default useAlert
