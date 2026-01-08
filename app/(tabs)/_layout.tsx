import { Tabs } from 'expo-router';
import React from 'react';
import { Calendar, Image } from 'lucide-react-native';

import { UserMenu } from '@/components/user-menu';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

function TabBarIcon({ Icon, color }: { Icon: any; color: string }) {
  return <Icon size={24} color={color} strokeWidth={2} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Calendar} color={color} />,
          headerRight: () => <UserMenu />,
        }}
      />
      <Tabs.Screen
        name="image-picker"
        options={{
          title: 'Image Picker',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Image} color={color} />,
        }}
      />
    </Tabs>
  );
}
