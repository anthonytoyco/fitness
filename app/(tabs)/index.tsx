import { Text } from '@/components/ui/text';
import { useUserData } from '@/hooks/useUserData';
import { ScrollView, View } from 'react-native';

export default function TabOneScreen() {
  const { fullName } = useUserData();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="gap-6 p-6">
        <Text className="text-2xl font-bold">Welcome, {fullName}!</Text>
        <Text className="text-muted-foreground">
          This is your fitness dashboard. Use the user menu in the header to manage your account.
        </Text>
      </View>
    </ScrollView>
  );
}
