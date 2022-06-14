import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import './src/util/exception-handler';

import { AppRegistry } from 'react-native';
import App from './App/src';
import { name as appName } from './App/app.json';

import { enableScreens, enableFreeze } from 'react-native-screens';
import { enableLatestRenderer } from 'react-native-maps';

enableScreens(true);
enableFreeze(true);
enableLatestRenderer();

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
