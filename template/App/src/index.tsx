import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import MapView from 'react-native-maps';
import { name as appName } from '../app.json';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ApplicationProvider, useApplication, darkTheme, lightTheme, restart, getVersion, Button } from '@library';
import { database, localStorage } from '@app/db/database';
import DatabaseProvider, { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Database, Q } from '@nozbe/watermelondb';

import { useNetInfo } from '@react-native-community/netinfo';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';

import messaging, { remoteMessaging, setForegroundMessageHandler, setBackgroundMessageHandler } from '@library/util/notification';
import { Notification } from '@app/db/models';

setBackgroundMessageHandler();

const Version = () => {
  const version = getVersion();
  return <Text style={{ color: 'black' }}>{JSON.stringify(version, null, 2)}</Text>;
};

const NetworkStatus = () => {
  const netInfo = useNetInfo();
  return <Text style={{ color: 'black' }}>{JSON.stringify(netInfo, null, 2)}</Text>;
};

const Restart = () => {
  const restartHandler = useCallback(() => {
    restart();
  }, []);

  return <Button label="Restart" onPress={restartHandler} style={{ alignItems: 'center' }} />;
};

const MobileService = () => {
  const { mobileService } = useApplication();

  return (
    <Text>
      {appName} - {mobileService}
    </Text>
  );
};

const Map = () => (
  <MapView
    style={{ height: '100%' }}
    mapType={'hybrid'}
    region={{
      latitude: -33.9321,
      longitude: 18.8602,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    }}
  />
);

const NavigateToNotifications = () => {
  const { navigate } = useNavigation();

  const handler = useCallback(() => {
    return navigate('Notifications');
  }, []);

  return <Button label="View Remote Notifications" onPress={handler} style={{ alignItems: 'center' }} />;
};

const NotificationsList = ({ notifications }: { notifications: Notification[] }) => {
  return (
    <>
      {notifications.map((notification) => (
        <View key={notification.id}>
          <Text>{notification.state}</Text>
          <Text>{notification.createdAt.toISOString()}</Text>
        </View>
      ))}
    </>
  );
};

const enhanceNotifications = withObservables([], ({ database }: { database: Database }) => {
  return {
    notifications: database.get<Notification>('notifications').query(Q.sortBy('created_at', 'desc')),
  };
});
const NotificationsListEnhanced = withDatabase(enhanceNotifications(NotificationsList));

const Stack = createNativeStackNavigator();
const RootScreen = ({ starts }: { starts: number }) => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
    <>
      <Map />
      <BottomSheet ref={bottomSheetRef} index={2} snapPoints={snapPoints} onChange={handleSheetChanges}>
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <MobileService />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
              <Icon name="rocket" size={30} color="#900" />
              <Text style={{ color: '#900', marginLeft: 20 }}>Restarted : {starts} times</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <Version />
          <View style={styles.separator} />
          <Restart />
          <View style={styles.separator} />
          <NavigateToNotifications />
          <View style={styles.separator} />
          <NetworkStatus />
          <View style={styles.separator} />
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
};

const App = () => {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => (colorScheme === 'dark' ? darkTheme : lightTheme), [colorScheme]);
  const [starts, setStarts] = React.useState(0);

  useEffect(() => {
    const getToken = async () => {
      const token = await remoteMessaging.getToken();
      console.log('token', token);
    };
    void getToken();

    const unsubscribe = setForegroundMessageHandler();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    void (async () => await localStorage.setItem('colorScheme', colorScheme?.toString() ?? ''))();
  }, [colorScheme]);

  useEffect(() => {
    void localStorage.getItem('starts', '1').then((value) => {
      if (value) {
        setStarts(parseInt(value, 10));
        void localStorage.setItem('starts', (parseInt(value, 10) + 1).toString());
      }
    });

    void (async () => await localStorage.setItem('version', JSON.stringify(getVersion()) ?? ''))();
    void (async () => await localStorage.setItem('startAt', dayjs().valueOf().toString()))();
  }, []);

  const RootScreenComponent = memo(() => <RootScreen starts={starts} />);

  return (
    <SafeAreaProvider>
      <ApplicationProvider>
        <StatusBar barStyle={'light-content'} />
        <DatabaseProvider database={database}>
          <NavigationContainer theme={theme}>
            <Stack.Navigator>
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name="Home"
                component={RootScreenComponent}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DatabaseProvider>
      </ApplicationProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    // flex: 1,
    // alignItems: 'center',
    marginHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginVertical: 10,
  },
});

export default App;
