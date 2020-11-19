import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme/theme'
import { MainTabType } from './tabTypes'

export default (name: MainTabType, focused: boolean) => {
  const {
    colors: { lightBlue, grayBlue, green, purple, white },
  } = useTheme<Theme>()
  if (!focused) return grayBlue

  if (name === 'Hotspots') return lightBlue
  if (name === 'Account') return green
  if (name === 'Network') return purple
  return white
}
