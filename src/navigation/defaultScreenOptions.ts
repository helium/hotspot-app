import { StackCardInterpolationProps } from '@react-navigation/stack'

export default {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  cardStyleInterpolator: ({
    current: { progress },
  }: StackCardInterpolationProps) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
}
