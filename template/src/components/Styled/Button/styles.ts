import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@library/hooks';

export const useStyles = () => {
  const { colors } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.secondaryCard,
          justifyContent: 'flex-end',
          borderRadius: 5,
          marginVertical: 6,
        },
        contentContainer: {
          padding: 12,
        },
      }),
    [colors.secondaryCard],
  );
};
