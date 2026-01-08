import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { openAppSettings } from '@/utils/permissions';

export default function CameraScreen() {
  const { colorScheme } = useColorScheme();
  const { hasPermission, isRequesting } = useCameraPermissions();

  const device = useCameraDevice('back');

  if (hasPermission === null || isRequesting) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-lg">
          {isRequesting ? 'Requesting camera permission...' : 'Checking camera permissions...'}
        </Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View className="flex-1 items-center justify-center gap-4 p-4">
        <Text className="mb-2 text-center text-lg font-semibold">Camera Permission Denied</Text>
        <Text className="mb-4 text-center text-muted-foreground">
          Camera access was denied. You can enable it in your device settings to use this feature.
        </Text>
        <Button onPress={openAppSettings}>
          <Text>Open Settings</Text>
        </Button>
      </View>
    );
  }

  if (!device) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg">No camera device found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} photo={true} />
      <View className="absolute bottom-8 left-0 right-0 items-center">
        <View className="rounded-lg bg-background/80 p-4">
          <Text className="text-center font-semibold">Camera Active</Text>
          <Text className="mt-1 text-center text-sm text-muted-foreground">Vision Camera Demo</Text>
        </View>
      </View>
    </View>
  );
}
