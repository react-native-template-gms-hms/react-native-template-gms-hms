/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useTheme as useRNTheme } from '@react-navigation/native';
import type { lightTheme } from '@library/theme';

const useTheme: () => typeof lightTheme = useRNTheme as any;

export default useTheme;
