import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Fitness',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function Screen() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-6">
        <View className="items-center gap-3">
          <Text className="text-center text-5xl font-bold">💪</Text>
          <Text className="text-center text-4xl font-bold">Fitness Tracker</Text>
          <Text className="max-w-md text-center text-lg text-muted-foreground">
            Your personal fitness companion
          </Text>
        </View>

        <View className="max-w-md gap-4">
          <View className="gap-2">
            <Text className="text-base font-semibold">📊 Track Your Progress</Text>
            <Text className="text-sm text-muted-foreground">
              Log your workouts, meals, and activities with ease
            </Text>
          </View>
          <View className="gap-2">
            <Text className="text-base font-semibold">🎯 Reach Your Goals</Text>
            <Text className="text-sm text-muted-foreground">
              Set personalized fitness goals and monitor your achievements
            </Text>
          </View>
          <View className="gap-2">
            <Text className="text-base font-semibold">📈 Stay Motivated</Text>
            <Text className="text-sm text-muted-foreground">
              Visualize your journey and celebrate your wins
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <Link href="/auth/signup" asChild>
            <Button size="lg">
              <Text>Get Started</Text>
            </Button>
          </Link>
          <Link href="/auth/signin" asChild>
            <Button size="lg" variant="outline">
              <Text>Sign In</Text>
            </Button>
          </Link>
        </View>
      </View>
    </>
  );
}
