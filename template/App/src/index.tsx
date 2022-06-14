import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import MapView from 'react-native-maps';
import { name as appName } from '../app.json';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider, useApplication, darkTheme, lightTheme, restart, getVersion } from '@library';
import { database, localStorage } from '@app/db/database';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import { useNetInfo } from '@react-native-community/netinfo';
import BottomSheet from '@gorhom/bottom-sheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';

const Version = () => {
  const version = getVersion();
  return <Text style={{ color: 'black' }}>{JSON.stringify(version)}</Text>;
};

const NetworkStatus = () => {
  const netInfo = useNetInfo();
  return <Text style={{ color: 'black' }}>{JSON.stringify(netInfo)}</Text>;
};

const Restart = () => {
  const restartHandler = useCallback(() => {
    restart();
  }, []);

  return <Button title="Restart" onPress={restartHandler} />;
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
      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints} onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <MobileService />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
              <Icon name="rocket" size={30} color="#900" />
              <Text style={{ color: '#900', marginLeft: 20 }}>Restarted : {starts} times</Text>
            </View>
          </View>
          <Version />
          <Restart />
          <NetworkStatus />
        </View>
      </BottomSheet>
    </>
  );
};

const App = () => {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => (colorScheme === 'dark' ? darkTheme : lightTheme), [colorScheme]);
  const [starts, setStarts] = React.useState(0);

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
    // void (async () => await localStorage.setItem('starts', (await localStorage.getItem('starts', '1')).toString()))();
  }, []);

  // const RootScreenComponent = useMemo(({ starts }: { starts: number }) => {
  //   return <RootScreen starts={starts} />;
  // }, []);

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
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default App;
