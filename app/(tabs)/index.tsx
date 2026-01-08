import { cssInterop, useColorScheme } from 'nativewind';
import React, { useCallback, useRef } from 'react';
import { Animated, Easing, Text, TouchableOpacity } from 'react-native';
import {
  AgendaList,
  CalendarProvider,
  ExpandableCalendar,
  WeekCalendar,
} from 'react-native-calendars';
import type XDate from 'xdate';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import AgendaItem from '@/components/agenda-item';
import { CALENDAR_THEME, getCalendarTheme } from '@/lib/theme';
import { agendaItems, getMarkedDates } from 'mocks/agendaItems';

// Apply cssInterop for components to work with NativeWind
cssInterop(TouchableOpacity, {
  className: 'style',
});

cssInterop(AgendaList, {
  className: {
    target: 'sectionStyle',
  },
});

// Constants
const ITEMS: any[] = agendaItems;

// Component Props
interface Props {
  weekView?: boolean;
}

const Calendar = ({ weekView }: Props) => {
  // Hooks
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Refs
  const marked = useRef(getMarkedDates());
  const rotation = useRef(new Animated.Value(1));

  // Theme configuration
  const theme = getCalendarTheme(isDark);
  const todayBtnTheme = { todayButtonTextColor: CALENDAR_THEME.primaryColor };

  // Callbacks
  const renderItem = useCallback(({ item }: any) => {
    return <AgendaItem item={item} />;
  }, []);

  const renderHeader = useCallback((date?: XDate) => {
    return (
      <TouchableOpacity className="my-2.5 flex-row items-center justify-center">
        <Text className="mr-1.5 text-base font-bold text-foreground">
          {date?.toString('MMMM yyyy')}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  const onCalendarToggled = useCallback((isOpen: boolean) => {
    Animated.timing(rotation.current, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  // Render
  return (
    <CalendarProvider date={ITEMS[1]?.title} showTodayButton theme={todayBtnTheme}>
      {weekView ? (
        <WeekCalendar firstDay={1} markedDates={marked.current} theme={theme} />
      ) : (
        <ExpandableCalendar
          renderHeader={renderHeader}
          onCalendarToggled={onCalendarToggled}
          theme={theme}
          firstDay={1}
          markedDates={marked.current}
          renderArrow={(direction) =>
            direction === 'left' ? (
              <ChevronLeft size={24} color={theme.arrowColor} />
            ) : (
              <ChevronRight size={24} color={theme.arrowColor} />
            )
          }
          allowShadow={false}
          closeOnDayPress={true}
          style={{ paddingBottom: 4 }}
        />
      )}
      <AgendaList
        sections={ITEMS}
        renderItem={renderItem}
        className="bg-muted/50 text-muted-foreground"
      />
    </CalendarProvider>
  );
};

export default Calendar;
