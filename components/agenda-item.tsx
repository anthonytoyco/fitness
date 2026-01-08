import React, { useCallback } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { cssInterop } from 'nativewind';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Ellipsis } from 'lucide-react-native';

import isEmpty from 'lodash/isEmpty';

// Apply cssInterop for TouchableOpacity to work with NativeWind
cssInterop(TouchableOpacity, {
  className: 'style',
});

// Component Props
interface ItemProps {
  item: any;
}

const AgendaItem = (props: ItemProps) => {
  // Destructure props
  const { item } = props;

  // Callbacks
  const buttonPressed = useCallback(() => {
    Alert.alert('Show me more');
  }, []);

  const itemPressed = useCallback(() => {
    Alert.alert(item.title);
  }, [item]);

  const emptyItemPressed = useCallback(() => {
    Alert.alert('No data entered for today!');
  }, [item]);

  // Render empty agenda item
  if (isEmpty(item)) {
    return (
      <TouchableOpacity
        onPress={emptyItemPressed}
        className="h-[52px] justify-center border-b border-border pl-5">
        <Text className="text-sm italic text-muted-foreground">No Data Entered For Today!</Text>
      </TouchableOpacity>
    );
  }

  // Render agenda item
  return (
    <TouchableOpacity
      onPress={itemPressed}
      className="flex-row border-b border-border bg-background p-5">
      <View>
        <Text className="text-foreground">{item.hour}</Text>
        <Text className="ml-1 mt-1 text-xs text-muted-foreground">{item.duration}</Text>
      </View>
      <Text className="ml-4 text-base font-bold text-foreground">{item.title}</Text>
      <View className="flex-1 items-end">
        <Button size="icon" variant="outline" onPress={buttonPressed}>
          <Icon as={Ellipsis} />
        </Button>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AgendaItem);
