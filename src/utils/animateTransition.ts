import { LayoutAnimation, LayoutAnimationConfig, Platform } from 'react-native'
import Config from 'react-native-config'
import store from '../store/store'

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
  const state = store.getState()
  const { animationsEnabled } = state.account.settings

  if ((Platform.OS === 'android' && !enabledOnAndroid) || !animationsEnabled)
    return

  if (__DEV__ && Config.LOG_ANIMATIONS === 'true') {
    // eslint-disable-next-line no-console
    console.log('animateTransition:', { id, enabledOnAndroid })
  }

  LayoutAnimation.configureNext(
    config || {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    },
  )
}
