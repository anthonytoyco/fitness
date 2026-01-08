import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [multipleImages, setMultipleImages] = useState<string[]>([]);

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickMultipleImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      setMultipleImages(uris);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="gap-6 p-6">
        <View className="items-center gap-4">
          <Text className="text-2xl font-bold">Image Picker Demo</Text>
          <Text className="text-center text-muted-foreground">
            Demonstrate React Native image picker with gallery, camera, and multiple selection
          </Text>
        </View>

        <View className="gap-4">
          <Text className="text-lg font-semibold">Single Image Selection</Text>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button onPress={pickImageFromGallery} variant="default">
                <Text>Pick from Gallery</Text>
              </Button>
            </View>
            <View className="flex-1">
              <Button onPress={takePhoto} variant="secondary">
                <Text>Take Photo</Text>
              </Button>
            </View>
          </View>

          {selectedImage && (
            <View className="overflow-hidden rounded-lg border border-border bg-card">
              <Image source={{ uri: selectedImage }} className="h-64 w-full" resizeMode="cover" />
            </View>
          )}
        </View>

        <View className="h-px bg-border" />

        <View className="gap-4">
          <Text className="text-lg font-semibold">Multiple Image Selection</Text>

          <Button onPress={pickMultipleImages} variant="outline">
            <Text>Pick Multiple Images</Text>
          </Button>

          {multipleImages.length > 0 && (
            <View className="gap-2">
              <Text className="text-sm text-muted-foreground">
                Selected {multipleImages.length} image(s)
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {multipleImages.map((uri, index) => (
                  <View key={index} className="overflow-hidden rounded-md border border-border">
                    <Image source={{ uri }} className="h-24 w-24" resizeMode="cover" />
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View className="gap-4 rounded-lg border border-border bg-muted p-4">
          <Text className="font-semibold">Features Demonstrated:</Text>
          <View className="gap-2">
            <Text className="text-sm text-muted-foreground">
              • Pick single image from gallery with editing
            </Text>
            <Text className="text-sm text-muted-foreground">• Take photo with camera</Text>
            <Text className="text-sm text-muted-foreground">
              • Select multiple images from gallery
            </Text>
            <Text className="text-sm text-muted-foreground">• Permission handling</Text>
            <Text className="text-sm text-muted-foreground">• Image preview and display</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
