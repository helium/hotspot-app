import { LayoutAnimation, Platform } from 'react-native'
import Config from 'react-native-config'

export default (id: string, enabledOnAndroid = true) => {
  if (Platform.OS === 'android' && !enabledOnAndroid) return

  if (__DEV__ && Config.LOG_ANIMATIONS === 'true') {
    console.log('animateTransition:', { id, enabledOnAndroid })
  }

  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
}
