import { Tabs } from 'expo-router';
import React from 'react';
import { Calendar, Camera } from 'lucide-react-native';

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
          title: 'Log Food',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Camera} color={color} />,
        }}
      />
      <Tabs.Screen
        name="entry"
        options={{
          href: null, // Hide this tab
        }}
      />
    </Tabs>
  );
}
