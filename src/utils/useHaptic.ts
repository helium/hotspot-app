import * as Haptics from 'expo-haptics'
import { useSelector } from 'react-redux'
import { RootState } from '../store/rootReducer'

export type FeedbackStyle = 'light' | 'medium' | 'heavy'
export type NotificationStyle = 'success' | 'warning' | 'error'

const impactStyles: Record<string, Haptics.ImpactFeedbackStyle> = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
}

const notificationStyles: Record<string, Haptics.NotificationFeedbackType> = {
  success: Haptics.NotificationFeedbackType.Success,
  warning: Haptics.NotificationFeedbackType.Warning,
  error: Haptics.NotificationFeedbackType.Error,
}

const useHaptic = () => {
  const isHapticDisabled = useSelector(
    (state: RootState) => state.app.isHapticDisabled,
  )

  const triggerImpact = (feedbackStyle: FeedbackStyle = 'medium') => {
    if (isHapticDisabled) return

    Haptics.impactAsync(impactStyles[feedbackStyle])
  }

  const triggerNotification = (
    notificationStyle: NotificationStyle = 'success',
  ) => {
    if (isHapticDisabled) return

    Haptics.notificationAsync(notificationStyles[notificationStyle])
  }

  const triggerNavHaptic = () => {
    if (isHapticDisabled) return

    triggerImpact('light')
  }
  return { triggerImpact, triggerNotification, triggerNavHaptic }
}

export default useHaptic
