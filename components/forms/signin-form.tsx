import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, type TextInput, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast } from 'sonner-native';

import { signinSchema } from '@/schemas/auth';
import { signIn } from '@/utils/auth';
import { router } from 'expo-router';

export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof signinSchema>) {
    const result = await signIn(data);

    if (result.success) {
      toast.success('Signed in successfully!');
      router.replace('/(tabs)');
    } else {
      toast.error('Error signing in', {
        description: result.error || 'An error occurred during sign in',
      });
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Sign In to Fitness</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    returnKeyType="next"
                  />
                )}
              />
              {errors.email && <Text className="text-sm text-red-500">{errors.email.message}</Text>}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4"
                  onPress={() => {
                    router.replace('/auth/forgot-password');
                  }}>
                  <Text className="font-normal leading-4">Forgot your password?</Text>
                </Button>
              </View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
              {errors.password && (
                <Text className="text-sm text-red-500">{errors.password.message}</Text>
              )}
            </View>
            <Button className="w-full" onPress={handleSubmit(onSubmit)}>
              <Text>Sign In</Text>
            </Button>
          </View>
          <View className="flex-row items-center justify-center">
            <Text className="text-center text-sm">Don&apos;t have an account? </Text>
            <Pressable
              onPress={() => {
                router.replace('/auth/signup');
              }}>
              <Text className="text-sm underline underline-offset-4">Sign up</Text>
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
