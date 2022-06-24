import { useEffect, useState } from 'react';
import { getMobileService } from '@library/util/native';
import { Platform } from 'react-native';

export const useMobileService = () => {
  const [service, setService] = useState<'ios' | 'gms' | 'hms' | 'none'>('none');
  useEffect(() => {
    async function getService() {
      if (Platform.OS === 'ios') {
        setService('ios');
      } else if (Platform.OS === 'android') {
        const service = await getMobileService();
        setService(service.mobileService);
      }

      return service;
    }

    void getService();
  }, []);

  return {
    service,
  };
};
