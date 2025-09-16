'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  CalendarIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListIcon,
  GridIcon,
  CalendarDaysIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  GoogleCalendarEvent,
  GetGoogleCalendarEventsOutput,
} from '@/lib/ai/tools/google-calendar/types';

export type CalendarViewType = 'month' | 'week' | 'day' | 'list';

export interface GoogleCalendarComponentProps {
  output: GetGoogleCalendarEventsOutput;
  input?: {
    calendarId?: string;
    timeMin?: string;
    timeMax?: string;
  };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}

// Utility functions for time range detection
const detectTimeRange = (
  timeMin?: string,
  timeMax?: string,
): CalendarViewType => {
  if (!timeMin || !timeMax) {
    return 'month'; // Default to month view
  }

  const start = new Date(timeMin);
  const end = new Date(timeMax);
  const diffInDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays <= 1) {
    return 'day';
  } else if (diffInDays <= 7) {
    return 'week';
  } else if (diffInDays <= 31) {
    return 'month';
  } else {
    return 'month'; // Use month view for multi-month ranges
  }
};

const getTimeRangeFromView = (view: CalendarViewType, currentDate: Date) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();

  switch (view) {
    case 'month':
      return {
        timeMin: new Date(year, month, 1).toISOString(),
        timeMax: new Date(year, month + 1, 0).toISOString(),
      };
    case 'week': {
      const startOfWeek = new Date(currentDate);
      // Adjust to Monday (day 1) instead of Sunday (day 0)
      const dayOfWeek = currentDate.getDay();
      const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, so go back 6 days to Monday
      startOfWeek.setDate(currentDate.getDate() + daysToMonday);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Monday + 6 days = Sunday
      return {
        timeMin: startOfWeek.toISOString(),
        timeMax: endOfWeek.toISOString(),
      };
    }
    case 'day':
      return {
        timeMin: new Date(year, month, date).toISOString(),
        timeMax: new Date(year, month, date).toISOString(),
      };
    default:
      return {
        timeMin: new Date(year, month, 1).toISOString(),
        timeMax: new Date(year, month + 1, 0).toISOString(),
      };
  }
};

export const GoogleCalendarLoading: React.FC<{
  input?: { calendarId?: string; timeMin?: string; timeMax?: string };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}> = ({ input: _input, onAction: _onAction }) => {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg size-10" />
          <div className="flex-1">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
      </div>

      {/* Calendar Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        <div className="flex space-x-2">
          <div className="size-8 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="size-8 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: 35 }, (_, i) => (
          <div
            key={`skeleton-day-${i}-${Date.now()}`}
            className="h-20 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          />
        ))}
      </div>

      {/* Events List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={`skeleton-event-${i}-${Date.now()}`}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const GoogleCalendarComponent: React.FC<
  GoogleCalendarComponentProps
> = ({ output, input, onAction }) => {
  const { events, summary } = output;
  const [selectedEvent, setSelectedEvent] =
    useState<GoogleCalendarEvent | null>(null);

  // Detect the appropriate view based on time range
  const detectedView = useMemo(() => {
    return detectTimeRange(input?.timeMin, input?.timeMax);
  }, [input?.timeMin, input?.timeMax]);

  // Initialize currentDate based on input time range, fallback to today
  const initialDate = useMemo(() => {
    if (input?.timeMin) {
      return new Date(input.timeMin);
    }
    return new Date();
  }, [input?.timeMin]);

  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState<CalendarViewType>(detectedView);

  // Update currentDate when input changes
  useEffect(() => {
    if (input?.timeMin) {
      setCurrentDate(new Date(input.timeMin));
    }
  }, [input?.timeMin]);

  // Update viewMode when detectedView changes
  useEffect(() => {
    setViewMode(detectedView);
  }, [detectedView]);

  // Calendar navigation
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const increment = direction === 'next' ? 1 : -1;

    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + increment);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + increment * 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + increment);
        break;
    }
    setCurrentDate(newDate);

    // Request new events for the new date range
    const timeRange = getTimeRangeFromView(viewMode, newDate);
    onAction?.({
      action: 'get_events_for_view',
      data: {
        calendarId: input?.calendarId,
        timeMin: timeRange.timeMin,
        timeMax: timeRange.timeMax,
        viewMode: viewMode,
      },
    });
  };

  // Get calendar days for current month (Sunday to Saturday format)
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Start from the Sunday of the week containing the first day of the month
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // Get week days for current week (Monday to Sunday)
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    // Adjust to Monday (day 1) instead of Sunday (day 0)
    const dayOfWeek = currentDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, so go back 6 days to Monday
    startOfWeek.setDate(currentDate.getDate() + daysToMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Helper function to format date as YYYY-MM-DD without timezone conversion
  const formatDateAsString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const targetDateString = formatDateAsString(date); // YYYY-MM-DD format

    const filteredEvents = events.filter((event) => {
      // Get event start date
      let eventStartDate: string;
      if (event.start.dateTime) {
        // For dateTime events, use the local date without timezone conversion
        const eventDate = new Date(event.start.dateTime);
        eventStartDate = formatDateAsString(eventDate);
      } else if (event.start.date) {
        eventStartDate = event.start.date;
      } else {
        return false;
      }

      // Get event end date
      let eventEndDate: string;
      if (event.end.dateTime) {
        // For dateTime events, use the local date without timezone conversion
        const eventDate = new Date(event.end.dateTime);
        eventEndDate = formatDateAsString(eventDate);
      } else if (event.end.date) {
        eventEndDate = event.end.date;
      } else {
        return false;
      }

      // Check if the target date falls within the event's date range
      return (
        targetDateString >= eventStartDate && targetDateString <= eventEndDate
      );
    });

    return filteredEvents;
  };

  // Format time for display
  const formatTime = (
    dateTime: string | undefined,
    date: string | undefined,
  ) => {
    if (dateTime) {
      return new Date(dateTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    if (date) {
      return 'All Day';
    }
    return '';
  };

  // Format date for display
  const formatDate = (
    dateTime: string | undefined,
    date: string | undefined,
  ) => {
    if (dateTime) {
      return new Date(dateTime).toLocaleDateString();
    }
    if (date) {
      return new Date(date).toLocaleDateString();
    }
    return '';
  };

  // Action handlers
  const handleCreateEvent = () => {
    onAction?.({
      action: 'create_event',
      data: {
        calendarId: input?.calendarId,
        date: formatDateAsString(currentDate),
      },
    });
  };

  const handleEditEvent = (event: GoogleCalendarEvent) => {
    onAction?.({
      action: 'edit_event',
      data: {
        eventId: event.id,
        eventTitle: event.summary,
        currentData: event,
      },
    });
  };

  const handleDeleteEvent = (event: GoogleCalendarEvent) => {
    onAction?.({
      action: 'delete_event',
      data: {
        eventId: event.id,
        eventTitle: event.summary,
        calendarId: input?.calendarId,
      },
    });
  };

  const handleViewEventDetails = (event: GoogleCalendarEvent) => {
    setSelectedEvent(event);
    // No longer calling LLM, just opening modal
  };

  const handleShareEvent = (event: GoogleCalendarEvent) => {
    onAction?.({
      action: 'share_event',
      data: {
        eventId: event.id,
        eventTitle: event.summary,
        eventUrl: `https://calendar.google.com/calendar/event?eid=${event.id}`,
      },
    });
  };

  const handleRefreshEvents = () => {
    onAction?.({
      action: 'refresh_events',
      data: {
        calendarId: input?.calendarId,
        timeMin: input?.timeMin,
        timeMax: input?.timeMax,
      },
    });
  };

  const handleViewModeChange = (newViewMode: CalendarViewType) => {
    // setViewMode(newViewMode);

    // For week view, always use today's date to calculate the week
    // This ensures consistent behavior when switching from month to week
    const dateToUse = newViewMode === 'week' ? new Date() : currentDate;

    // Get the time range for the new view mode
    const timeRange = getTimeRangeFromView(newViewMode, dateToUse);

    // Request new events for the selected view
    onAction?.({
      action: 'get_events_for_view',
      data: {
        calendarId: input?.calendarId,
        timeMin: timeRange.timeMin,
        timeMax: timeRange.timeMax,
        viewMode: newViewMode,
      },
    });
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);

    // Request new events for today
    const timeRange = getTimeRangeFromView(viewMode, today);
    onAction?.({
      action: 'get_events_for_view',
      data: {
        calendarId: input?.calendarId,
        timeMin: timeRange.timeMin,
        timeMax: timeRange.timeMax,
        viewMode: viewMode,
      },
    });
  };

  const calendarDays = getCalendarDays();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
            <CalendarIcon className="size-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Google Calendar
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {summary}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleRefreshEvents}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handleCreateEvent}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <PlusIcon className="size-4" />
            New Event
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleViewModeChange('month')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              viewMode === 'month'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
            )}
          >
            <GridIcon className="size-4" />
            Month
          </button>
          <button
            type="button"
            onClick={() => handleViewModeChange('week')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              viewMode === 'week'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
            )}
          >
            <CalendarDaysIcon className="size-4" />
            Week
          </button>
          <button
            type="button"
            onClick={() => handleViewModeChange('day')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              viewMode === 'day'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
            )}
          >
            <CalendarIcon className="size-4" />
            Day
          </button>
          <button
            type="button"
            onClick={() => handleViewModeChange('list')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              viewMode === 'list'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
            )}
          >
            <ListIcon className="size-4" />
            List
          </button>
        </div>
      </div>

      {/* Dynamic View Rendering */}
      {viewMode === 'month' && (
        <>
          {/* Month View Navigation */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => navigateDate('prev')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleGoToToday}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => navigateDate('next')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={`month-day-${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                  className={cn(
                    'min-h-[100px] p-1 border border-gray-200 dark:border-gray-600 rounded-lg',
                    isCurrentMonth
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-gray-50 dark:bg-gray-800',
                    isToday &&
                      'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-600',
                  )}
                >
                  <div
                    className={cn(
                      'text-sm font-medium mb-1',
                      isCurrentMonth
                        ? 'text-gray-900 dark:text-gray-100'
                        : 'text-gray-400 dark:text-gray-500',
                      isToday && 'text-blue-600 dark:text-blue-400',
                    )}
                  >
                    {day.getDate()}
                  </div>

                  {/* Events for this day */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleViewEventDetails(event)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleViewEventDetails(event);
                          }
                        }}
                        className="text-xs p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors truncate"
                        title={event.summary}
                      >
                        {event.summary}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {viewMode === 'week' && (
        <>
          {/* Week View Navigation */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Week of {getWeekDays()[0].toLocaleDateString()} -{' '}
              {getWeekDays()[6].toLocaleDateString()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => navigateDate('prev')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleGoToToday}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => navigateDate('next')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </div>
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {getWeekDays().map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={`week-day-${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                  className={cn(
                    'min-h-[200px] p-2 border border-gray-200 dark:border-gray-600 rounded-lg',
                    isToday &&
                      'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-600',
                  )}
                >
                  <div
                    className={cn(
                      'text-sm font-medium mb-2 text-gray-900 dark:text-gray-100',
                      isToday && 'text-blue-600 dark:text-blue-400',
                    )}
                  >
                    {dayNames[index]} {day.getDate()}
                  </div>

                  {/* Events for this day */}
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleViewEventDetails(event)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleViewEventDetails(event);
                          }
                        }}
                        className="text-xs p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        title={event.summary}
                      >
                        <div className="font-medium truncate">
                          {event.summary}
                        </div>
                        <div className="text-xs opacity-75">
                          {formatTime(event.start.dateTime, event.start.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {viewMode === 'day' && (
        <>
          {/* Day View Navigation */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => navigateDate('prev')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={handleGoToToday}
                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => navigateDate('next')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </div>
          </div>

          {/* Day Events */}
          <div className="space-y-4">
            {getEventsForDate(currentDate).length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <CalendarIcon className="size-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>No events for this day</p>
                <button
                  type="button"
                  onClick={handleCreateEvent}
                  className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Create an event
                </button>
              </div>
            ) : (
              getEventsForDate(currentDate)
                .sort((a, b) => {
                  const timeA = a.start.dateTime
                    ? new Date(a.start.dateTime).getTime()
                    : 0;
                  const timeB = b.start.dateTime
                    ? new Date(b.start.dateTime).getTime()
                    : 0;
                  return timeA - timeB;
                })
                .map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {event.summary}
                          </h4>
                          {event.status && (
                            <span
                              className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium',
                                {
                                  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300':
                                    event.status === 'confirmed',
                                  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300':
                                    event.status === 'tentative',
                                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300':
                                    event.status === 'cancelled',
                                },
                              )}
                            >
                              {event.status}
                            </span>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {event.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <ClockIcon className="size-3" />
                            <span>
                              {formatTime(
                                event.start.dateTime,
                                event.start.date,
                              )}
                              {event.end.dateTime &&
                                ` - ${formatTime(event.end.dateTime, event.end.date)}`}
                            </span>
                          </div>

                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="size-3" />
                              <span>{event.location}</span>
                            </div>
                          )}

                          {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center gap-1">
                              <UsersIcon className="size-3" />
                              <span>{event.attendees.length} attendees</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Event Actions */}
                      <div className="flex items-center gap-1 ml-4">
                        <button
                          type="button"
                          onClick={() => handleViewEventDetails(event)}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditEvent(event)}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit Event"
                        >
                          <EditIcon className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleShareEvent(event)}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          title="Share Event"
                        >
                          <span className="text-sm">📤</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event)}
                          className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete Event"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </>
      )}

      {viewMode === 'list' && (
        /* List View */
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CalendarIcon className="size-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No events found</p>
              <button
                type="button"
                onClick={handleCreateEvent}
                className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Create your first event
              </button>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {event.summary}
                      </h4>
                      {event.status && (
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            {
                              'bg-green-100 text-green-800':
                                event.status === 'confirmed',
                              'bg-yellow-100 text-yellow-800':
                                event.status === 'tentative',
                              'bg-red-100 text-red-800':
                                event.status === 'cancelled',
                            },
                          )}
                        >
                          {event.status}
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {event.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="size-3" />
                        <span>
                          {formatDate(event.start.dateTime, event.start.date)} -{' '}
                          {formatTime(event.start.dateTime, event.start.date)}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="size-3" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center gap-1">
                          <UsersIcon className="size-3" />
                          <span>{event.attendees.length} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Actions */}
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      type="button"
                      onClick={() => handleViewEventDetails(event)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditEvent(event)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Edit Event"
                    >
                      <EditIcon className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareEvent(event)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      title="Share Event"
                    >
                      <span className="text-sm">📤</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(event)}
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete Event"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {selectedEvent.summary}
            </h3>

            {selectedEvent.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedEvent.description}
              </p>
            )}

            <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="size-4" />
                <span>
                  {formatDate(
                    selectedEvent.start.dateTime,
                    selectedEvent.start.date,
                  )}{' '}
                  -{' '}
                  {formatTime(
                    selectedEvent.start.dateTime,
                    selectedEvent.start.date,
                  )}
                </span>
              </div>

              {selectedEvent.end.dateTime && (
                <div className="flex items-center gap-2">
                  <ClockIcon className="size-4" />
                  <span>
                    End:{' '}
                    {formatDate(
                      selectedEvent.end.dateTime,
                      selectedEvent.end.date,
                    )}{' '}
                    -{' '}
                    {formatTime(
                      selectedEvent.end.dateTime,
                      selectedEvent.end.date,
                    )}
                  </span>
                </div>
              )}

              {selectedEvent.location && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="size-4" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.attendees &&
                selectedEvent.attendees.length > 0 && (
                  <div className="flex items-start gap-2">
                    <UsersIcon className="size-4 mt-0.5" />
                    <div>
                      <p className="font-medium">Attendees:</p>
                      <ul className="list-disc list-inside">
                        {selectedEvent.attendees.map((attendee) => (
                          <li key={attendee.email}>
                            {attendee.displayName || attendee.email}
                            {attendee.responseStatus && (
                              <span className="ml-2 text-xs">
                                ({attendee.responseStatus})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleEditEvent(selectedEvent);
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteEvent(selectedEvent);
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const GoogleCalendarError: React.FC<{
  error: string;
  input?: { calendarId?: string; timeMin?: string; timeMax?: string };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}> = ({ error, input, onAction }) => {
  const handleRetry = () => {
    onAction?.({
      action: 'retry_load_events',
      data: {
        calendarId: input?.calendarId,
        timeMin: input?.timeMin,
        timeMax: input?.timeMax,
      },
    });
  };

  const handleRefresh = () => {
    onAction?.({
      action: 'refresh_calendar',
      data: { calendarId: input?.calendarId },
    });
  };

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-4xl">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-red-100 dark:bg-red-900 rounded-lg p-2">
          <CalendarIcon className="size-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-red-800 dark:text-red-300">
            Error Loading Google Calendar
          </h3>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRetry}
          className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex-1 px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};
