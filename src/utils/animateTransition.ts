import { LayoutAnimation, Platform } from 'react-native'

export default (id: string, enabledOnAndroid = true) => {
  if (Platform.OS === 'android' && !enabledOnAndroid) return

  if (__DEV__) {
    console.log('animateTransition:', { id, enabledOnAndroid })
  }

  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
}
