import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import { UserMenu } from '@/components/user-menu';
import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/hooks/useClientOnlyValue';
import { useColorScheme } from '@/hooks/useColorScheme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => <UserMenu />,
        }}
      />
      <Tabs.Screen
        name="image-picker"
        options={{
          title: 'Image Picker',
          tabBarIcon: ({ color }) => <TabBarIcon name="image" color={color} />,
        }}
      />
    </Tabs>
  );
}
