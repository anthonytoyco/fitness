import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { MealLog } from '@/types/foodLog';
import { deleteMealLog } from '@/utils/database';
import { Flame, Trash2 } from 'lucide-react-native';

interface MealLogItemProps {
  mealLog: MealLog;
  onDelete?: () => void;
}

export function MealLogItem({ mealLog, onDelete }: MealLogItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    Alert.alert('Delete Meal Log', 'Are you sure you want to delete this meal log?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          try {
            await deleteMealLog(mealLog.id);
            setIsOpen(false);
            onDelete?.();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete meal log');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMealTypeEmoji = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '🍳';
      case 'lunch':
        return '🍽️';
      case 'dinner':
        return '🍴';
      case 'snack':
        return '🍪';
      default:
        return '🍽️';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TouchableOpacity>
          <Card className="mb-2">
            <CardContent className="p-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center gap-2">
                  <Text className="text-2xl">{getMealTypeEmoji(mealLog.mealType)}</Text>
                  <View className="flex-1">
                    <Text className="font-semibold capitalize">{mealLog.mealType}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {formatTime(mealLog.timestamp)}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-1">
                  <Flame size={16} color="#ef4444" />
                  <Text className="font-semibold text-primary">{mealLog.totalCalories} cal</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            {getMealTypeEmoji(mealLog.mealType)} {mealLog.mealType}
          </DialogTitle>
          <DialogDescription>
            {formatTime(mealLog.timestamp)} • {mealLog.totalCalories} calories
          </DialogDescription>
        </DialogHeader>

        <View className="gap-4">
          {/* Food Items */}
          <View className="gap-2">
            <Text className="font-semibold">Food Items</Text>
            {mealLog.foodItems.map((item, index) => (
              <View key={index} className="rounded-lg border border-border p-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="font-medium">{item.name}</Text>
                    {item.quantity && (
                      <Text className="text-xs text-muted-foreground">{item.quantity}</Text>
                    )}
                  </View>
                  <Text className="font-semibold text-primary">{item.calories} cal</Text>
                </View>
                <View className="mt-2 flex-row flex-wrap gap-2">
                  <Text className="text-xs text-muted-foreground">
                    P: {item.nutrients.protein}g
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    C: {item.nutrients.carbohydrates}g
                  </Text>
                  <Text className="text-xs text-muted-foreground">F: {item.nutrients.fat}g</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Nutritional Summary */}
          <View className="gap-2">
            <Text className="font-semibold">Nutritional Summary</Text>
            <View className="gap-1 rounded-lg border border-border p-3">
              <View className="flex-row justify-between">
                <Text className="text-sm">Total Protein:</Text>
                <Text className="text-sm font-medium">
                  {mealLog.totalNutrients.protein.toFixed(1)}g
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm">Total Carbs:</Text>
                <Text className="text-sm font-medium">
                  {mealLog.totalNutrients.carbohydrates.toFixed(1)}g
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm">Total Fat:</Text>
                <Text className="text-sm font-medium">
                  {mealLog.totalNutrients.fat.toFixed(1)}g
                </Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {mealLog.notes && (
            <View className="gap-2">
              <Text className="font-semibold">Notes</Text>
              <Text className="text-sm text-muted-foreground">{mealLog.notes}</Text>
            </View>
          )}

          {/* Actions */}
          <Button
            variant="destructive"
            onPress={handleDelete}
            disabled={isDeleting}
            className="mt-2">
            <View className="flex-row items-center gap-2">
              <Trash2 size={16} color="white" />
              <Text>{isDeleting ? 'Deleting...' : 'Delete Meal Log'}</Text>
            </View>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
