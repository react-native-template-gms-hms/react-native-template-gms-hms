import type { ReactNode } from 'react';
import type { TextStyle } from 'react-native';

export interface StyledLabelProps {
  children: string | ReactNode;
  style?: TextStyle;
}
