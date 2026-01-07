import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import * as React from 'react';
import { TextInput, View } from 'react-native';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AlertCircleIcon, CheckCircleIcon, InfoIcon } from 'lucide-react-native';

import { resetPasswordSchema } from '@/schemas/auth';
import { resetPassword } from '@/utils/auth';
import { router } from 'expo-router';

export function ResetPasswordForm() {
  const codeInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      code: '',
    },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    setError(null);
    setSuccess(false);

    const result = await resetPassword(data);

    if (result.success) {
      setSuccess(true);
      // Navigate to sign in screen after a short delay
      setTimeout(() => {
        router.replace('/auth/signin');
      }, 2000);
    } else {
      setError(result.error || 'An error occurred while resetting password');
    }
  }

  return (
    <View className="gap-6">
      <Card className="shadow-none border-border/0 sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-xl text-center sm:text-left">Reset password</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the code sent to your email and set a new password
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          {error && (
            <Alert variant="destructive" icon={AlertCircleIcon}>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default" icon={CheckCircleIcon}>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Password reset successfully! Redirecting to sign in...
              </AlertDescription>
            </Alert>
          )}
          <View className="gap-6">
            <View className="gap-1.5">
              <View className="flex-row items-center gap-1">
                <Label htmlFor="password">New password</Label>
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
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="password"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="next"
                    onSubmitEditing={() => codeInputRef.current?.focus()}
                  />
                )}
              />
              {errors.newPassword && (
                <Text className="text-sm text-red-500">{errors.newPassword.message}</Text>
              )}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="code">Verification code</Label>
              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={codeInputRef}
                    id="code"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="send"
                    keyboardType="numeric"
                    autoComplete="sms-otp"
                    textContentType="oneTimeCode"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
              {errors.code && <Text className="text-sm text-red-500">{errors.code.message}</Text>}
            </View>
            <Button className="w-full" onPress={handleSubmit(onSubmit)}>
              <Text>Reset Password</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
