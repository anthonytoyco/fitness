export interface FoodItem {
  name: string;
  calories: number;
  quantity?: string;
  nutrients: NutritionInfo;
}

export interface NutritionInfo {
  // Macronutrients (in grams unless specified)
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;

  // Vitamins (in mg or mcg)
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
  vitaminE?: number;
  vitaminK?: number;
  vitaminB6?: number;
  vitaminB12?: number;

  // Minerals (in mg unless specified)
  calcium?: number;
  iron?: number;
  magnesium?: number;
  potassium?: number;
  sodium?: number;
  zinc?: number;
}

export interface MealLog {
  id: string;
  userId: string;
  timestamp: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: FoodItem[];
  totalCalories: number;
  totalNutrients: NutritionInfo;
  imageUrl?: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  timestamp: Date;
  activityType: 'workout' | 'run' | 'walk' | 'gym' | 'other';
  duration?: number; // in minutes
  caloriesBurned?: number;
  distance?: number; // in km or miles
  notes?: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD format
  meals: MealLog[];
  activities: ActivityLog[];
  totalCaloriesConsumed: number;
  totalCaloriesBurned: number;
}
