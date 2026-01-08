import { cssInterop, useColorScheme } from 'nativewind';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  WeekCalendar,
} from 'react-native-calendars';
import type XDate from 'xdate';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { MealLogItem } from '@/components/meal-log-item';
import { ActivityLogItem } from '@/components/activity-log-item';
import { CALENDAR_THEME, getCalendarTheme } from '@/lib/theme';
import { getMealLogs } from '@/utils/database';
import { useAuth } from '@/contexts/AuthContext';
import type { MealLog, ActivityLog, DayLog } from '@/types/foodLog';

// Apply cssInterop for components to work with NativeWind
cssInterop(TouchableOpacity, {
  className: 'style',
});

cssInterop(AgendaList, {
  className: {
    target: 'sectionStyle',
  },
});

// Component Props
interface Props {
  weekView?: boolean;
}

const Calendar = ({ weekView }: Props) => {
  // Hooks
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();

  // State
  const [sections, setSections] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Refs
  const rotation = useRef(new Animated.Value(1));

  // Theme configuration
  const theme = getCalendarTheme(isDark);
  const todayBtnTheme = { todayButtonTextColor: CALENDAR_THEME.primaryColor };

  // Fetch logs data
  const fetchLogs = useCallback(async () => {
    if (!user) {
      setSections([]);
      setMarkedDates({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch data for the last 30 days and next 7 days
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const [mealLogs] = await Promise.all([getMealLogs(user.uid, startDate, endDate)]);

      // Group logs by date
      const logsByDate: { [date: string]: { meals: MealLog[]; activities: ActivityLog[] } } = {};

      mealLogs.forEach((meal) => {
        const dateKey = meal.timestamp.toISOString().split('T')[0];
        if (!logsByDate[dateKey]) {
          logsByDate[dateKey] = { meals: [], activities: [] };
        }
        logsByDate[dateKey].meals.push(meal);
      });

      // Create sections for AgendaList
      const newSections = Object.entries(logsByDate)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .map(([date, logs]) => {
          const totalCalories = logs.meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
          const totalBurned = logs.activities.reduce(
            (sum, activity) => sum + (activity.caloriesBurned || 0),
            0
          );

          return {
            title: date,
            data: [
              {
                date,
                meals: logs.meals,
                activities: logs.activities,
                totalCaloriesConsumed: totalCalories,
                totalCaloriesBurned: totalBurned,
              },
            ],
          };
        });

      setSections(newSections);

      // Create marked dates
      const newMarked: any = {};
      Object.keys(logsByDate).forEach((date) => {
        newMarked[date] = { marked: true, dotColor: CALENDAR_THEME.primaryColor };
      });
      setMarkedDates(newMarked);
    } catch (error) {
      console.error('Error fetching logs:', error);
      // Set empty data on error so app doesn't crash
      setSections([]);
      setMarkedDates({});
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Callbacks
  const renderItem = useCallback(
    ({ item }: any) => {
      const dayLog: DayLog = item;

      return (
        <View className="gap-4 p-4">
          {/* Summary Card */}
          <View className="rounded-lg border border-border bg-card p-4">
            <Text className="mb-2 text-lg font-semibold">
              {new Date(dayLog.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-sm text-muted-foreground">Consumed</Text>
                <Text className="text-xl font-bold text-primary">
                  {dayLog.totalCaloriesConsumed} cal
                </Text>
              </View>
              <View>
                <Text className="text-sm text-muted-foreground">Burned</Text>
                <Text className="text-xl font-bold text-green-600">
                  {dayLog.totalCaloriesBurned} cal
                </Text>
              </View>
              <View>
                <Text className="text-sm text-muted-foreground">Net</Text>
                <Text
                  className={`text-xl font-bold ${
                    dayLog.totalCaloriesConsumed - dayLog.totalCaloriesBurned > 0
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}>
                  {dayLog.totalCaloriesConsumed - dayLog.totalCaloriesBurned} cal
                </Text>
              </View>
            </View>
          </View>

          {/* Meals Section */}
          {dayLog.meals.length > 0 && (
            <View className="gap-2">
              <Text className="text-base font-semibold">Meals</Text>
              {dayLog.meals.map((meal) => (
                <MealLogItem key={meal.id} mealLog={meal} onDelete={fetchLogs} />
              ))}
            </View>
          )}

          {/* Activities Section */}
          {dayLog.activities.length > 0 && (
            <View className="gap-2">
              <Text className="text-base font-semibold">Activities</Text>
              {dayLog.activities.map((activity) => (
                <ActivityLogItem key={activity.id} activityLog={activity} onDelete={fetchLogs} />
              ))}
            </View>
          )}

          {/* Empty state */}
          {dayLog.meals.length === 0 && dayLog.activities.length === 0 && (
            <View className="items-center py-8">
              <Text className="text-muted-foreground">No logs for this day</Text>
            </View>
          )}
        </View>
      );
    },
    [fetchLogs]
  );

  const renderHeader = useCallback((date?: XDate) => {
    return (
      <TouchableOpacity className="my-2.5 flex-row items-center justify-center">
        <Text className="mr-1.5 text-base font-bold text-foreground">
          {date?.toString('MMMM yyyy')}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  const onCalendarToggled = useCallback((isOpen: boolean) => {
    Animated.timing(rotation.current, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  // Render
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Loading your logs...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="mb-2 text-xl font-semibold">Welcome to Fitness Tracker</Text>
        <Text className="text-center text-muted-foreground">
          Please sign in to view your fitness logs
        </Text>
      </View>
    );
  }

  return (
    <CalendarProvider
      date={selectedDate}
      onDateChanged={setSelectedDate}
      showTodayButton
      theme={todayBtnTheme}>
      {weekView ? (
        <WeekCalendar firstDay={1} markedDates={markedDates} theme={theme} />
      ) : (
        <ExpandableCalendar
          renderHeader={renderHeader}
          onCalendarToggled={onCalendarToggled}
          theme={theme}
          firstDay={1}
          markedDates={markedDates}
          renderArrow={(direction) =>
            direction === 'left' ? (
              <ChevronLeft size={24} color={theme.arrowColor} />
            ) : (
              <ChevronRight size={24} color={theme.arrowColor} />
            )
          }
          allowShadow={false}
          closeOnDayPress={true}
          style={{ paddingBottom: 4 }}
        />
      )}
      {sections.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="mb-2 text-xl font-semibold">No Logs Yet</Text>
          <Text className="mb-4 text-center text-muted-foreground">
            Start logging your meals and activities using the tabs below!
          </Text>
          <Text className="text-center text-sm text-muted-foreground">
            📷 Use "Log Food" to analyze meals{'\n'}
            🎤 Use "Log Activity" to record workouts
          </Text>
        </View>
      ) : (
        <AgendaList
          sections={sections}
          renderItem={renderItem}
          className="bg-muted/50 text-muted-foreground"
        />
      )}
    </CalendarProvider>
  );
};

export default Calendar;
