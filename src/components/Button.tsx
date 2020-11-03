/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  useRestyle,
  spacing,
  border,
  backgroundColor,
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
} from '@shopify/restyle';

import Text from './Text';
import { Theme } from '../theme/theme';

const restyleFunctions = [spacing, border, backgroundColor];
type Props = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> & {
    onPress: () => void;
    title: string;
  };

const Button = ({ onPress, title, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);

  return (
    <TouchableOpacity onPress={onPress}>
      <View {...props}>
        <Text variant="button">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
