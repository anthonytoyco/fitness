import { ThemeToggle } from '@/components/theme-toggle';
import { Stack } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { ResetPasswordForm } from '@/components/reset-password-form';

const SCREEN_OPTIONS = {
  title: 'Reset Password',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function ResetPasswordScreen() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-1 items-center justify-center p-4 py-8 sm:p-6"
          keyboardDismissMode="interactive">
          <View className="w-full max-w-sm">
            <ResetPasswordForm />
          </View>
        </ScrollView>
      </View>
    </>
  );
}
