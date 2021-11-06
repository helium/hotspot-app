import { LayoutAnimation, LayoutAnimationConfig, Platform } from 'react-native'
import Config from 'react-native-config'

type AnimationOptions = {
  enabledOnAndroid: boolean
  config?: LayoutAnimationConfig
}
export default (
  id: string,
  { enabledOnAndroid, config }: AnimationOptions = {
    enabledOnAndroid: true,
    config: LayoutAnimation.Presets.easeInEaseOut,
  },
) => {
  if (Platform.OS === 'android' && !enabledOnAndroid) return

  if (__DEV__ && Config.LOG_ANIMATIONS === 'true') {
    // eslint-disable-next-line no-console
    console.log('animateTransition:', { id, enabledOnAndroid })
  }

  LayoutAnimation.configureNext(config || LayoutAnimation.Presets.easeInEaseOut)
}
