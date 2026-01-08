import { useState } from 'react';
import { View, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeFoodImage } from '@/utils/gemini';
import { saveFoodLog } from '@/utils/database';
import { useAuth } from '@/contexts/AuthContext';
import type { FoodItem, NutritionInfo } from '@/types/foodLog';

export default function ImagePickerScreen() {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [totalNutrients, setTotalNutrients] = useState<NutritionInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const pickImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      analyzeImage(result.assets[0]);
    }
  };

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Gallery permission is required to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      analyzeImage(result.assets[0]);
    }
  };

  const analyzeImage = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!asset.base64) {
      Alert.alert('Error', 'Failed to read image data.');
      return;
    }

    setIsAnalyzing(true);
    setFoodItems([]);
    setTotalCalories(0);
    setTotalNutrients(null);

    try {
      const result = await analyzeFoodImage(asset.base64, asset.mimeType || 'image/jpeg');
      setFoodItems(result.foodItems);
      setTotalCalories(result.totalCalories);
      setTotalNutrients(result.totalNutrients);
    } catch (error) {
      Alert.alert('Analysis Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveLog = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save food logs.');
      return;
    }

    if (foodItems.length === 0) {
      Alert.alert('Error', 'No food items to save.');
      return;
    }

    setIsSaving(true);
    try {
      await saveFoodLog({
        userId: user.uid,
        imageUri: selectedImage || '',
        foodItems,
        totalCalories,
        totalNutrients: totalNutrients!,
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Food log saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedImage(null);
            setFoodItems([]);
            setTotalCalories(0);
            setTotalNutrients(null);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Save Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Calorie Logging</CardTitle>
            <CardDescription>
              Take a photo of your food and let AI analyze its nutritional content
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            <Button onPress={pickImageFromCamera}>
              <Text>Take Photo</Text>
            </Button>
            <Button variant="outline" onPress={pickImageFromGallery}>
              <Text>Choose from Gallery</Text>
            </Button>
          </CardContent>
        </Card>

        {selectedImage && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Image</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                source={{ uri: selectedImage }}
                className="h-64 w-full rounded-lg"
                resizeMode="cover"
              />
            </CardContent>
          </Card>
        )}

        {isAnalyzing && (
          <Card>
            <CardContent className="items-center py-8">
              <ActivityIndicator size="large" />
              <Text className="mt-4 text-muted-foreground">Analyzing your food...</Text>
            </CardContent>
          </Card>
        )}

        {foodItems.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>Total Calories: {totalCalories} kcal</CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                {foodItems.map((item, index) => (
                  <View key={index} className="rounded-lg border border-border p-3">
                    <Text className="text-lg font-semibold">{item.name}</Text>
                    <Text className="text-muted-foreground">{item.quantity}</Text>
                    <Text className="mt-1 font-medium text-primary">{item.calories} calories</Text>

                    <View className="mt-3 gap-1">
                      <Text className="text-sm">
                        Protein: {item.nutrients.protein}g • Carbs: {item.nutrients.carbohydrates}g
                        • Fat: {item.nutrients.fat}g
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        Fiber: {item.nutrients.fiber}g • Sugar: {item.nutrients.sugar}g
                      </Text>
                    </View>
                  </View>
                ))}
              </CardContent>
            </Card>

            {totalNutrients && (
              <Card>
                <CardHeader>
                  <CardTitle>Total Nutritional Information</CardTitle>
                </CardHeader>
                <CardContent className="gap-2">
                  <View className="flex-row justify-between">
                    <Text>Protein:</Text>
                    <Text className="font-medium">{totalNutrients.protein.toFixed(1)}g</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text>Carbohydrates:</Text>
                    <Text className="font-medium">{totalNutrients.carbohydrates.toFixed(1)}g</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text>Fat:</Text>
                    <Text className="font-medium">{totalNutrients.fat.toFixed(1)}g</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text>Fiber:</Text>
                    <Text className="font-medium">{totalNutrients.fiber?.toFixed(1) ?? 0}g</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text>Sugar:</Text>
                    <Text className="font-medium">{totalNutrients.sugar?.toFixed(1) ?? 0}g</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text>Sodium:</Text>
                    <Text className="font-medium">{totalNutrients.sodium?.toFixed(1) ?? 0}mg</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text>Calcium:</Text>
                    <Text className="font-medium">{totalNutrients.calcium?.toFixed(1) ?? 0}mg</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text>Iron:</Text>
                    <Text className="font-medium">{totalNutrients.iron?.toFixed(1) ?? 0}mg</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text>Vitamin A:</Text>
                    <Text className="font-medium">
                      {totalNutrients.vitaminA?.toFixed(1) ?? 0}mcg
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text>Vitamin C:</Text>
                    <Text className="font-medium">
                      {totalNutrients.vitaminC?.toFixed(1) ?? 0}mg
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text>Potassium:</Text>
                    <Text className="font-medium">
                      {totalNutrients.potassium?.toFixed(1) ?? 0}mg
                    </Text>
                  </View>
                </CardContent>
              </Card>
            )}

            <Button onPress={handleSaveLog} disabled={isSaving}>
              <Text>{isSaving ? 'Saving...' : 'Save to Calendar'}</Text>
            </Button>
          </>
        )}
      </View>
    </ScrollView>
  );
}
