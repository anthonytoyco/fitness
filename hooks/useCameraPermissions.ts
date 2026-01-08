import { useEffect, useState } from 'react';
import { useCameraPermission } from 'react-native-vision-camera';

export function useCameraPermissions() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const askForPermission = async () => {
      if (hasPermission === false && !permissionDenied && !isRequesting) {
        setIsRequesting(true);
        const granted = await requestPermission();
        setIsRequesting(false);
        if (!granted) {
          setPermissionDenied(true);
        }
      }
    };

    askForPermission();
  }, [hasPermission, permissionDenied, isRequesting, requestPermission]);

  return {
    hasPermission,
    permissionDenied,
    isRequesting,
  };
}
