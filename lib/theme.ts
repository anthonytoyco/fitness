import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { Platform } from 'react-native';

/**
 * Core theme colors for light and dark modes
 * Used across the app for consistent styling
 */
export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 3.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 3.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(0 0% 3.9%)',
    primary: 'hsl(0 0% 9%)',
    primaryForeground: 'hsl(0 0% 98%)',
    secondary: 'hsl(0 0% 96.1%)',
    secondaryForeground: 'hsl(0 0% 9%)',
    muted: 'hsl(0 0% 96.1%)',
    mutedForeground: 'hsl(0 0% 45.1%)',
    accent: 'hsl(0 0% 96.1%)',
    accentForeground: 'hsl(0 0% 9%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    border: 'hsl(0 0% 89.8%)',
    input: 'hsl(0 0% 89.8%)',
    ring: 'hsl(0 0% 63%)',
    radius: '0.625rem',
    chart1: 'hsl(12 76% 61%)',
    chart2: 'hsl(173 58% 39%)',
    chart3: 'hsl(197 37% 24%)',
    chart4: 'hsl(43 74% 66%)',
    chart5: 'hsl(27 87% 67%)',
  },
  dark: {
    background: 'hsl(0 0% 3.9%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(0 0% 3.9%)',
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(0 0% 3.9%)',
    popoverForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(0 0% 98%)',
    primaryForeground: 'hsl(0 0% 9%)',
    secondary: 'hsl(0 0% 14.9%)',
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(0 0% 14.9%)',
    mutedForeground: 'hsl(0 0% 63.9%)',
    accent: 'hsl(0 0% 14.9%)',
    accentForeground: 'hsl(0 0% 98%)',
    destructive: 'hsl(0 70.9% 59.4%)',
    border: 'hsl(0 0% 14.9%)',
    input: 'hsl(0 0% 14.9%)',
    ring: 'hsl(300 0% 45%)',
    radius: '0.625rem',
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(160 60% 45%)',
    chart3: 'hsl(30 80% 55%)',
    chart4: 'hsl(280 65% 60%)',
    chart5: 'hsl(340 75% 55%)',
  },
};

/**
 * Calendar-specific theme constants
 */
export const CALENDAR_THEME = {
  primaryColor: '#00AAAF',
  todayColor: '#31748f',
  dotColor: '#9ccfd8',
  fontSize: {
    month: 16,
    dayHeader: 12,
    day: 18,
  },
  fontWeight: {
    month: 'bold' as const,
    dayHeader: 'normal' as const,
    day: '500' as const,
  },
};

/**
 * Generate calendar theme configuration for react-native-calendars
 * @param isDark - Whether dark mode is enabled
 * @returns Calendar theme object
 */
export function getCalendarTheme(isDark: boolean) {
  const colors = isDark ? THEME.dark : THEME.light;
  const disabledColor = isDark ? '#666' : '#999';

  return {
    // Arrow navigation
    arrowColor: colors.foreground,
    arrowStyle: { padding: 0 },

    // Expandable knob
    expandableKnobColor: CALENDAR_THEME.primaryColor,

    // Month header
    monthTextColor: colors.foreground,
    textMonthFontSize: CALENDAR_THEME.fontSize.month,
    textMonthFontWeight: CALENDAR_THEME.fontWeight.month,

    // Day header (weekday names)
    textSectionTitleColor: colors.foreground,
    textDayHeaderFontSize: CALENDAR_THEME.fontSize.dayHeader,
    textDayHeaderFontWeight: CALENDAR_THEME.fontWeight.dayHeader,

    // Day numbers
    dayTextColor: isDark ? colors.mutedForeground : CALENDAR_THEME.primaryColor,
    todayTextColor: CALENDAR_THEME.todayColor,
    textDayFontSize: CALENDAR_THEME.fontSize.day,
    textDayFontWeight: CALENDAR_THEME.fontWeight.day,
    textDayStyle: { marginTop: Platform.OS === 'android' ? 2 : 4 },

    // Selected day
    selectedDayBackgroundColor: CALENDAR_THEME.primaryColor,
    selectedDayTextColor: 'white',

    // Disabled dates
    textDisabledColor: disabledColor,

    // Dots (marked dates)
    dotColor: CALENDAR_THEME.dotColor,
    selectedDotColor: 'white',
    disabledDotColor: disabledColor,
    dotStyle: { marginTop: -2 },

    // Calendar background
    calendarBackground: colors.background,
    backgroundColor: colors.background,
  };
}

/**
 * Navigation theme configuration
 */
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
