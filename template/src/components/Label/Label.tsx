import React, { memo } from 'react';
import { TextStyle } from 'react-native';
import { StyledLabel } from '@library/components/Styled/Label';

interface LabelProps {
  label: string;
  labelStyle?: TextStyle;
}

const LabelComponent = ({ label, labelStyle }: LabelProps) => <StyledLabel style={labelStyle}>{label}</StyledLabel>;

export const Label = memo(LabelComponent);
