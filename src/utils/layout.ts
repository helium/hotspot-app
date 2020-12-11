import { Dimensions } from 'react-native'

export const { width, height } = Dimensions.get('window')
export const hp = (percentage: number) =>
  Math.round((percentage * height) / 100)
export const wp = (percentage: number) => Math.round((percentage * width) / 100)
export const ww = width
export const wh = height
