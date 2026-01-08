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
import type { ActivityLog } from '@/types/foodLog';
import { deleteActivityLog } from '@/utils/database';
import { Activity, Clock, Flame, MapPin, Trash2 } from 'lucide-react-native';

interface ActivityLogItemProps {
  activityLog: ActivityLog;
  onDelete?: () => void;
}

export function ActivityLogItem({ activityLog, onDelete }: ActivityLogItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    Alert.alert('Delete Activity Log', 'Are you sure you want to delete this activity log?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          try {
            await deleteActivityLog(activityLog.id);
            setIsOpen(false);
            onDelete?.();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete activity log');
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'run':
        return '🏃';
      case 'walk':
        return '🚶';
      case 'gym':
        return '🏋️';
      case 'workout':
        return '💪';
      default:
        return '🎯';
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
                  <Text className="text-2xl">{getActivityIcon(activityLog.activityType)}</Text>
                  <View className="flex-1">
                    <Text className="font-semibold capitalize">{activityLog.activityType}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {formatTime(activityLog.timestamp)}
                    </Text>
                  </View>
                </View>
                {activityLog.caloriesBurned && (
                  <View className="flex-row items-center gap-1">
                    <Flame size={16} color="#10b981" />
                    <Text className="font-semibold text-green-600">
                      {activityLog.caloriesBurned} cal
                    </Text>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            {getActivityIcon(activityLog.activityType)} {activityLog.activityType}
          </DialogTitle>
          <DialogDescription>{formatTime(activityLog.timestamp)}</DialogDescription>
        </DialogHeader>

        <View className="gap-4">
          {/* Activity Details */}
          <View className="gap-3">
            {activityLog.duration && (
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground">Duration</Text>
                  <Text className="font-semibold">{activityLog.duration} minutes</Text>
                </View>
              </View>
            )}

            {activityLog.distance && (
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MapPin size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground">Distance</Text>
                  <Text className="font-semibold">{activityLog.distance} km</Text>
                </View>
              </View>
            )}

            {activityLog.caloriesBurned && (
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Flame size={20} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground">Calories Burned</Text>
                  <Text className="font-semibold text-green-600">
                    {activityLog.caloriesBurned} kcal
                  </Text>
                </View>
              </View>
            )}

            {activityLog.duration && activityLog.distance && (
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Activity size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground">Pace</Text>
                  <Text className="font-semibold">
                    {(activityLog.duration / activityLog.distance).toFixed(2)} min/km
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Notes */}
          {activityLog.notes && (
            <View className="gap-2">
              <Text className="font-semibold">Notes</Text>
              <View className="rounded-lg border border-border p-3">
                <Text className="text-sm text-muted-foreground">{activityLog.notes}</Text>
              </View>
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
              <Text>{isDeleting ? 'Deleting...' : 'Delete Activity Log'}</Text>
            </View>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
