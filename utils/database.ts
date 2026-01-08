import { db } from '@/FirebaseConfig';
import type { ActivityLog, MealLog, FoodItem, NutritionInfo } from '@/types/foodLog';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

export async function saveMealLog(mealLog: Omit<MealLog, 'id'>): Promise<string> {
  try {
    const mealLogData: any = {
      userId: mealLog.userId,
      timestamp: Timestamp.fromDate(mealLog.timestamp),
      mealType: mealLog.mealType,
      foodItems: mealLog.foodItems,
      totalCalories: mealLog.totalCalories,
      totalNutrients: mealLog.totalNutrients,
    };

    // Only add optional fields if they have values
    if (mealLog.imageUrl) {
      mealLogData.imageUrl = mealLog.imageUrl;
    }
    if (mealLog.notes) {
      mealLogData.notes = mealLog.notes;
    }

    const docRef = await addDoc(collection(db, 'mealLogs'), mealLogData);
    console.log('✅ Meal log saved successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving meal log:', error);
    throw new Error('Failed to save meal log');
  }
}

export async function saveActivityLog(activityLog: Omit<ActivityLog, 'id'>): Promise<string> {
  try {
    const activityLogData: any = {
      userId: activityLog.userId,
      timestamp: Timestamp.fromDate(activityLog.timestamp),
      activityType: activityLog.activityType,
    };

    // Only add optional fields if they have values
    if (activityLog.duration !== undefined) {
      activityLogData.duration = activityLog.duration;
    }
    if (activityLog.caloriesBurned !== undefined) {
      activityLogData.caloriesBurned = activityLog.caloriesBurned;
    }
    if (activityLog.distance !== undefined) {
      activityLogData.distance = activityLog.distance;
    }
    if (activityLog.notes) {
      activityLogData.notes = activityLog.notes;
    }

    const docRef = await addDoc(collection(db, 'activityLogs'), activityLogData);
    console.log('✅ Activity log saved successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving activity log:', error);
    throw new Error('Failed to save activity log');
  }
}

export async function getMealLogs(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<MealLog[]> {
  try {
    const q = query(
      collection(db, 'mealLogs'),
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const mealLogs: MealLog[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      mealLogs.push({
        id: doc.id,
        userId: data.userId,
        timestamp: data.timestamp.toDate(),
        mealType: data.mealType,
        foodItems: data.foodItems,
        totalCalories: data.totalCalories,
        totalNutrients: data.totalNutrients,
        imageUrl: data.imageUrl,
        notes: data.notes,
      });
    });

    return mealLogs;
  } catch (error) {
    console.error('Error getting meal logs:', error);
    throw new Error('Failed to get meal logs');
  }
}

export async function getActivityLogs(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<ActivityLog[]> {
  try {
    const q = query(
      collection(db, 'activityLogs'),
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const activityLogs: ActivityLog[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      activityLogs.push({
        id: doc.id,
        userId: data.userId,
        timestamp: data.timestamp.toDate(),
        activityType: data.activityType,
        duration: data.duration,
        caloriesBurned: data.caloriesBurned,
        distance: data.distance,
        notes: data.notes,
      });
    });

    return activityLogs;
  } catch (error) {
    console.error('Error getting activity logs:', error);
    throw new Error('Failed to get activity logs');
  }
}

export async function updateMealLog(
  mealLogId: string,
  updates: Partial<Omit<MealLog, 'id' | 'userId'>>
): Promise<void> {
  try {
    const mealLogRef = doc(db, 'mealLogs', mealLogId);
    const updateData: any = { ...updates };

    if (updates.timestamp) {
      updateData.timestamp = Timestamp.fromDate(updates.timestamp);
    }

    await updateDoc(mealLogRef, updateData);
  } catch (error) {
    console.error('Error updating meal log:', error);
    throw new Error('Failed to update meal log');
  }
}

export async function updateActivityLog(
  activityLogId: string,
  updates: Partial<Omit<ActivityLog, 'id' | 'userId'>>
): Promise<void> {
  try {
    const activityLogRef = doc(db, 'activityLogs', activityLogId);
    const updateData: any = { ...updates };

    if (updates.timestamp) {
      updateData.timestamp = Timestamp.fromDate(updates.timestamp);
    }

    await updateDoc(activityLogRef, updateData);
  } catch (error) {
    console.error('Error updating activity log:', error);
    throw new Error('Failed to update activity log');
  }
}

export async function deleteMealLog(mealLogId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'mealLogs', mealLogId));
  } catch (error) {
    console.error('Error deleting meal log:', error);
    throw new Error('Failed to delete meal log');
  }
}

export async function deleteActivityLog(activityLogId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'activityLogs', activityLogId));
  } catch (error) {
    console.error('Error deleting activity log:', error);
    throw new Error('Failed to delete activity log');
  }
}

export async function saveFoodLog(data: {
  userId: string;
  imageUri: string;
  foodItems: FoodItem[];
  totalCalories: number;
  totalNutrients: NutritionInfo;
  timestamp: Date;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  notes?: string;
}): Promise<string> {
  const mealLog: Omit<MealLog, 'id'> = {
    userId: data.userId,
    timestamp: data.timestamp,
    mealType: data.mealType || determineMealType(data.timestamp),
    foodItems: data.foodItems,
    totalCalories: data.totalCalories,
    totalNutrients: data.totalNutrients,
    imageUrl: data.imageUri,
    notes: data.notes,
  };

  return saveMealLog(mealLog);
}

function determineMealType(timestamp: Date): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
  const hour = timestamp.getHours();

  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 22) return 'dinner';
  return 'snack';
}
