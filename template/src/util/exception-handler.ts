import { Alert } from 'react-native';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';

const errorHandler = (e: { name: string; message: string; stack?: string }, isFatal: boolean) => {
  if (isFatal) {
    Alert.alert('Unexpected error occurred', `Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}`, [
      {
        text: 'Close',
      },
    ]);
  } else {
    console.log(e); // So that we can see it in the ADB logs in case of Android if needed
  }
};

setJSExceptionHandler(errorHandler, true);

setNativeExceptionHandler((errorString) => {
  console.log('setNativeExceptionHandler', errorString);
});
