import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Text } from '@/components/ui/text';

import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { cn } from '@/lib/utils';
import { signOut } from '@/utils/auth';
import { updateUserAvatar } from '@/utils/userProfile';

import type { TriggerRef } from '@rn-primitives/popover';
import { ImageIcon, LogOutIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { toast } from 'sonner-native';

export function UserMenu() {
  const popoverTriggerRef = React.useRef<TriggerRef>(null);
  const { user } = useAuth();
  const { fullName, photoUrl } = useUserData();
  const [isUpdatingAvatar, setIsUpdatingAvatar] = React.useState(false);

  async function onSignOut() {
    popoverTriggerRef.current?.close();
    const result = await signOut();
    if (result.success) {
      toast.success('Signed out successfully!');
    } else {
      toast.error('Error signing out', {
        description: result.error,
      });
    }
  }

  async function onChangeAvatar() {
    if (!user?.uid || isUpdatingAvatar) return;

    try {
      setIsUpdatingAvatar(true);
      const newPhotoUrl = await updateUserAvatar(user.uid);

      if (newPhotoUrl) {
        toast.success('Avatar updated successfully!');
        popoverTriggerRef.current?.close();
      }
    } catch (error: any) {
      toast.error('Failed to update avatar', {
        description: error.message || 'An error occurred',
      });
    } finally {
      setIsUpdatingAvatar(false);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button variant="ghost" size="icon" className="m-4 size-8 rounded-full bg-transparent pb-2">
          <UserAvatar fullName={fullName} photoUrl={photoUrl} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" side="bottom" className="w-80 p-0">
        <View className="gap-3 border-b border-border p-3">
          <View className="flex-row items-center gap-3">
            <UserAvatar fullName={fullName} photoUrl={photoUrl} className="size-10" />
            <View className="flex-1">
              <Text className="font-medium leading-5">{fullName}</Text>
              {user?.email && (
                <Text className="text-sm font-normal leading-4 text-muted-foreground">
                  {user.email}
                </Text>
              )}
            </View>
          </View>
          <View className="flex-row flex-wrap gap-3 py-0.5">
            <Button variant="destructive" size="sm" className="flex-1" onPress={onSignOut}>
              <Icon as={LogOutIcon} className="size-4" />
              <Text>Sign Out</Text>
            </Button>
          </View>
        </View>
        <Button
          variant="ghost"
          size="lg"
          className="h-16 justify-start gap-3 rounded-none rounded-b-md px-3 sm:h-14"
          onPress={onChangeAvatar}
          disabled={isUpdatingAvatar}>
          <View className="size-10 items-center justify-center">
            <View className="size-7 items-center justify-center rounded-full border border-dashed border-border bg-muted/50">
              <Icon as={ImageIcon} className="size-5" />
            </View>
          </View>
          <Text>{isUpdatingAvatar ? 'Updating...' : 'Change Avatar'}</Text>
        </Button>
      </PopoverContent>
    </Popover>
  );
}

interface UserAvatarProps extends Omit<React.ComponentProps<typeof Avatar>, 'alt'> {
  fullName: string;
  photoUrl?: string | null;
}

function UserAvatar({ className, fullName, photoUrl, ...props }: UserAvatarProps) {
  return (
    <Avatar alt={`${fullName}'s avatar`} className={cn('size-8', className)} {...props}>
      <AvatarImage source={{ uri: photoUrl || undefined }} />
      <AvatarFallback>
        <Text>{fullName[0]?.toUpperCase()}</Text>
      </AvatarFallback>
    </Avatar>
  );
}
