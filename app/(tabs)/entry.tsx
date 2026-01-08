import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState } from 'react';
import { Image, ScrollView, View, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { analyzeFoodImage } from '@/utils/gemini';
import { saveMealLog } from '@/utils/database';
import { useAuth } from '@/contexts/AuthContext';
import type { FoodItem, NutritionInfo } from '@/types/foodLog';
import { Camera, ImageIcon, Save } from 'lucide-react-native';

export default function FoodLogScreen() {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    foodItems: FoodItem[];
    totalCalories: number;
    totalNutrients: NutritionInfo;
  } | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const analyzeImage = async (imageUri: string) => {
    try {
      setIsAnalyzing(true);
      
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Analyze with Gemini
      const result = await analyzeFoodImage(base64);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Analysis Failed', 'Failed to analyze the food image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
      await analyzeImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setAnalysisResult(null);
      await analyzeImage(result.assets[0].uri);
    }
  };

  const saveLog = async () => {
    if (!user || !analysisResult) {
      Alert.alert('Error', 'Please log in and analyze an image first.');
      return;
    }

    try {
      setIsSaving(true);
      
      await saveMealLog({
        userId: user.uid,
        timestamp: new Date(),
        mealType,
        foodItems: analysisResult.foodItems,
        totalCalories: analysisResult.totalCalories,
        totalNutrients: analysisResult.totalNutrients,
        imageUrl: selectedImage || undefined,
      });

      Alert.alert('Success', 'Meal log saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedImage(null);
            setAnalysisResult(null);
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving log:', error);
      Alert.alert('Error', 'Failed to save meal log. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="gap-6 p-6">
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold">Log Your Meal</Text>
          <Text className="text-center text-muted-foreground">
            Take a photo of your food and let AI analyze the nutritional content
          </Text>
        </View>

        <View className="gap-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button onPress={pickImageFromGallery} variant="default" className="flex-row gap-2">
                <ImageIcon size={20} color="white" />
                <Text>Gallery</Text>
              </Button>
            </View>
            <View className="flex-1">
              <Button onPress={takePhoto} variant="secondary" className="flex-row gap-2">
                <Camera size={20} />
                <Text>Camera</Text>
              </Button>
            </View>
          </View>

          {selectedImage && (
            <Card className="overflow-hidden">
              <Image source={{ uri: selectedImage }} className="h-64 w-full" resizeMode="cover" />
            </Card>
          )}
        </View>

        {isAnalyzing && (
          <Card className="gap-4 p-6">
            <View className="items-center gap-3">
              <ActivityIndicator size="large" />
              <Text className="text-center text-lg font-semibold">
                Analyzing your food with AI...
              </Text>
              <Text className="text-center text-sm text-muted-foreground">
                This may take a few moments
              </Text>
            </View>
            <View className="gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </View>
          </Card>
        )}

        {analysisResult && !isAnalyzing && (
          <View className="gap-4">
            <Card className="gap-4 p-6">
              <Text className="text-xl font-bold">Analysis Results</Text>
              
              <View className="gap-1">
                <Text className="text-sm text-muted-foreground">Total Calories</Text>
                <Text className="text-3xl font-bold text-primary">
                  {analysisResult.totalCalories} kcal
                </Text>
              </View>

              <View className="h-px bg-border" />

              <View className="gap-3">
                <Text className="font-semibold">Food Items:</Text>
                {analysisResult.foodItems.map((item, index) => (
                  <View key={index} className="gap-1 rounded-lg bg-muted p-3">
                    <Text className="font-semibold">{item.name}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {item.quantity} • {item.calories} kcal
                    </Text>
                    <View className="mt-1 flex-row flex-wrap gap-2">
                      <Text className="text-xs text-muted-foreground">
                        Protein: {item.nutrients.protein}g
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        Carbs: {item.nutrients.carbohydrates}g
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        Fat: {item.nutrients.fat}g
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View className="h-px bg-border" />

              <View className="gap-2">
                <Text className="font-semibold">Total Nutrition:</Text>
                <View className="gap-1">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Protein</Text>
                    <Text className="text-sm font-medium">
                      {analysisResult.totalNutrients.protein.toFixed(1)}g
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Carbohydrates</Text>
                    <Text className="text-sm font-medium">
                      {analysisResult.totalNutrients.carbohydrates.toFixed(1)}g
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Fat</Text>
                    <Text className="text-sm font-medium">
                      {analysisResult.totalNutrients.fat.toFixed(1)}g
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Fiber</Text>
                    <Text className="text-sm font-medium">
                      {analysisResult.totalNutrients.fiber?.toFixed(1) || 0}g
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted-foreground">Sodium</Text>
                    <Text className="text-sm font-medium">
                      {analysisResult.totalNutrients.sodium?.toFixed(0) || 0}mg
                    </Text>
                  </View>
                </View>
              </View>
            </Card>

            <View className="gap-3">
              <Text className="font-semibold">Meal Type:</Text>
              <View className="flex-row gap-2">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={mealType === type ? 'default' : 'outline'}
                    onPress={() => setMealType(type)}
                    className="flex-1"
                  >
                    <Text className="capitalize">{type}</Text>
                  </Button>
                ))}
              </View>
            </View>

            <Button
              onPress={saveLog}
              variant="default"
              disabled={isSaving}
              className="flex-row gap-2"
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Save size={20} color="white" />
              )}
              <Text>{isSaving ? 'Saving...' : 'Save to Calendar'}</Text>
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
