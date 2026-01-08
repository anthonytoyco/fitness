import { Alert, Linking, Platform } from 'react-native';

export function openAppSettings() {
  Alert.alert(
    'Camera Permission Required',
    'Please enable camera permission in your device settings to use this feature.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            Linking.openSettings();
          }
        },
      },
    ]
  );
}
