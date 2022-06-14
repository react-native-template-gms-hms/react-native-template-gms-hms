import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getMobileService } from '@library/util/native';

interface ApplicationContextData {
  mobileService: 'ios' | 'gms' | 'hms' | 'none';
}
const ApplicationContext = createContext<ApplicationContextData>({
  mobileService: 'none',
});

const ApplicationProvider = ({ children }: { children: React.ReactNode }) => {
  const [mobileService, setMobileService] = useState<ApplicationContextData>({
    mobileService: 'none',
  });

  useEffect(() => {
    if (Platform.OS === 'ios') {
      setMobileService({ mobileService: 'ios' });
    } else if (Platform.OS === 'android') {
      void getMobileService().then((mobile) => {
        setMobileService(mobile);
      });
    }
  }, []);

  const context: ApplicationContextData = mobileService;

  return <ApplicationContext.Provider value={context}>{children}</ApplicationContext.Provider>;
};

const useApplication = () => {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error('useApplicationContext must be used within an ApplicationProvider');
  }

  return context;
};

export { ApplicationContext, ApplicationProvider, useApplication };
