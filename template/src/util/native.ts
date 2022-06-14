import { NativeModules } from 'react-native';

const { RNRestart, RNDetectMobileService, RNVersionNumber } = NativeModules;

type RestartType = {
  restart(): void;
};

type MobileServiceType = {
  getMobileService(): Promise<{ mobileService: 'ios' | 'gms' | 'hms' | 'none' }>;
};

type VersionType = {
  getConstants(): {
    appVersion: string;
    buildVersion: string;
    bundleIdentifier: string;
  };
};

export const restart = () => (RNRestart as RestartType).restart();
export const getMobileService = () => (RNDetectMobileService as MobileServiceType).getMobileService();
export const getVersion = () => (RNVersionNumber as VersionType).getConstants();
