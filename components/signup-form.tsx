import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AlertCircleIcon, InfoIcon } from 'lucide-react-native';

import { signupSchema } from '@/schemas/auth';
import { signUp } from '@/utils/auth';
import { router } from 'expo-router';

export function SignUpForm() {
  const lastNameInputRef = React.useRef<TextInput>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const passwordConfirmInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    setError(null);
    const result = await signUp(data);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.error || 'An error occurred during sign up');
    }
  }

  return (
    <View className="gap-6">
      <Card className="shadow-none border-border/0 sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-xl text-center sm:text-left">
            Create your Fitness Account
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          {error && (
            <Alert variant="destructive" icon={AlertCircleIcon}>
              <AlertTitle>Error signing up</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="firstName"
                    placeholder="John"
                    autoCapitalize="words"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    onSubmitEditing={() => lastNameInputRef.current?.focus()}
                    returnKeyType="next"
                  />
                )}
              />
              {errors.firstName && (
                <Text className="text-sm text-red-500">{errors.firstName.message}</Text>
              )}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={lastNameInputRef}
                    id="lastName"
                    placeholder="Doe"
                    autoCapitalize="words"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                    returnKeyType="next"
                  />
                )}
              />
              {errors.lastName && (
                <Text className="text-sm text-red-500">{errors.lastName.message}</Text>
              )}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={emailInputRef}
                    id="email"
                    placeholder="johndoe@example.com"
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
              <View className="flex flex-row items-center gap-1">
                <Label htmlFor="password">Password</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Icon as={InfoIcon} className="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text>
                      Passwords must have the following: {'\n\t'}• 8 - 20 characters {'\n\t'}• At
                      least 1 uppercase letter {'\n\t'}• At least 1 lowercase letter {'\n\t'}• At
                      least 1 number {'\n\t'}• At least 1 special character
                    </Text>
                  </TooltipContent>
                </Tooltip>
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
                    onSubmitEditing={() => passwordConfirmInputRef.current?.focus()}
                    returnKeyType="next"
                  />
                )}
              />
              {errors.password && (
                <Text className="text-sm text-red-500">{errors.password.message}</Text>
              )}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="passwordConfirm">Confirm Password</Label>
              <Controller
                control={control}
                name="passwordConfirm"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={passwordConfirmInputRef}
                    id="passwordConfirm"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
              {errors.passwordConfirm && (
                <Text className="text-sm text-red-500">{errors.passwordConfirm.message}</Text>
              )}
            </View>
            <Button className="w-full" onPress={handleSubmit(onSubmit)}>
              <Text>Continue</Text>
            </Button>
          </View>
          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-center">Already have an account? </Text>
            <Pressable
              onPress={() => {
                router.replace('/auth/signin');
              }}>
              <Text className="text-sm underline underline-offset-4">Sign in</Text>
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
