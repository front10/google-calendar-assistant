'use client';

import { useState, useMemo } from 'react';
import {
  ClockIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GetGoogleCalendarFreeBusyOutput } from '@/lib/ai/tools/google-calendar/types';

export interface FreeBusyComponentProps {
  output: GetGoogleCalendarFreeBusyOutput;
  input?: {
    timeMin?: string;
    timeMax?: string;
    calendarIds?: string[];
  };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}

// Helper function to format time for display
const formatTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to format date for display
const formatDate = (dateTime: string) => {
  return new Date(dateTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// Helper function to get duration in minutes
const getDuration = (start: string, end: string) => {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  return Math.round((endTime - startTime) / (1000 * 60));
};

// Helper function to check if a time slot is free
const isTimeSlotFree = (
  start: string,
  end: string,
  busyPeriods: { start: string; end: string }[],
) => {
  const slotStart = new Date(start).getTime();
  const slotEnd = new Date(end).getTime();

  return !busyPeriods.some((period) => {
    const periodStart = new Date(period.start).getTime();
    const periodEnd = new Date(period.end).getTime();
    return (
      (slotStart >= periodStart && slotStart < periodEnd) ||
      (slotEnd > periodStart && slotEnd <= periodEnd) ||
      (slotStart <= periodStart && slotEnd >= periodEnd)
    );
  });
};

// Generate time slots for the day
const generateTimeSlots = (
  timeMin: string,
  timeMax: string,
  intervalMinutes = 30,
) => {
  const slots = [];
  const start = new Date(timeMin);
  const end = new Date(timeMax);

  // Round start time to the nearest interval
  const roundedStart = new Date(start);
  roundedStart.setMinutes(
    Math.floor(roundedStart.getMinutes() / intervalMinutes) * intervalMinutes,
    0,
    0,
  );

  const current = new Date(roundedStart);
  while (current < end) {
    const slotEnd = new Date(current.getTime() + intervalMinutes * 60 * 1000);
    if (slotEnd <= end) {
      slots.push({
        start: current.toISOString(),
        end: slotEnd.toISOString(),
      });
    }
    current.setTime(current.getTime() + intervalMinutes * 60 * 1000);
  }

  return slots;
};

export const FreeBusyLoading: React.FC<{
  input?: { timeMin?: string; timeMax?: string; calendarIds?: string[] };
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
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={`skeleton-day-${i}-${Date.now()}`}
            className="h-20 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          />
        ))}
      </div>

      {/* Time Slots Skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={`skeleton-slot-${i}-${Date.now()}`}
            className="h-12 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          />
        ))}
      </div>
    </div>
  );
};

export const FreeBusyComponent: React.FC<FreeBusyComponentProps> = ({
  output,
  input,
  onAction,
}) => {
  const { calendars, summary, timeMin, timeMax } = output;
  const [expandedCalendars, setExpandedCalendars] = useState<Set<string>>(
    new Set(),
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

  // Generate time slots for the day
  const timeSlots = useMemo(() => {
    return generateTimeSlots(timeMin, timeMax, 30); // 30-minute intervals
  }, [timeMin, timeMax]);

  // Calculate availability for each time slot
  const availabilityData = useMemo(() => {
    return timeSlots.map((slot) => {
      const calendarAvailability = calendars.map((calendar) => ({
        calendarId: calendar.id,
        isFree: isTimeSlotFree(slot.start, slot.end, calendar.busy),
      }));

      const freeCalendars = calendarAvailability.filter(
        (cal) => cal.isFree,
      ).length;
      const totalCalendars = calendars.length;
      const availabilityPercentage =
        totalCalendars > 0 ? (freeCalendars / totalCalendars) * 100 : 100;

      return {
        ...slot,
        availabilityPercentage,
        freeCalendars,
        totalCalendars,
        calendarAvailability,
      };
    });
  }, [timeSlots, calendars]);

  // Get best time slots (highest availability)
  const bestTimeSlots = useMemo(() => {
    return availabilityData
      .filter((slot) => slot.availabilityPercentage >= 50)
      .sort((a, b) => b.availabilityPercentage - a.availabilityPercentage)
      .slice(0, 5);
  }, [availabilityData]);

  const toggleCalendarExpansion = (calendarId: string) => {
    const newExpanded = new Set(expandedCalendars);
    if (newExpanded.has(calendarId)) {
      newExpanded.delete(calendarId);
    } else {
      newExpanded.add(calendarId);
    }
    setExpandedCalendars(newExpanded);
  };

  const handleRefresh = () => {
    onAction?.({
      action: 'refresh_freebusy',
      data: {
        timeMin: input?.timeMin,
        timeMax: input?.timeMax,
        calendarIds: input?.calendarIds,
      },
    });
  };

  const handleCreateEvent = (slot: any) => {
    onAction?.({
      action: 'create_event_from_freebusy',
      data: {
        start: slot.start,
        end: slot.end,
        calendarIds: input?.calendarIds,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 dark:bg-green-900 rounded-lg p-2">
            <UsersIcon className="size-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Free/Busy Availability
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {summary}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCwIcon className="size-4 inline mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              viewMode === 'timeline'
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
            )}
          >
            <ClockIcon className="size-4" />
            Timeline
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              viewMode === 'calendar'
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
            )}
          >
            <CalendarIcon className="size-4" />
            Calendar
          </button>
        </div>
      </div>

      {/* Best Time Slots */}
      {bestTimeSlots.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
            🎯 Best Available Times
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bestTimeSlots.map((slot, index) => (
              <div
                key={`best-slot-${slot.start}-${index}`}
                role="button"
                tabIndex={0}
                className={cn(
                  'p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md',
                  selectedTimeSlot === slot.start
                    ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500',
                )}
                onClick={() => setSelectedTimeSlot(slot.start)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedTimeSlot(slot.start);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatTime(slot.start)} - {formatTime(slot.end)}
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {Math.round(slot.availabilityPercentage)}% free
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {slot.freeCalendars}/{slot.totalCalendars} calendars available
                </div>
                {selectedTimeSlot === slot.start && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateEvent(slot);
                    }}
                    className="w-full mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Create Event
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-2">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
            📅 Hourly Availability
          </h4>
          <div className="max-h-96 overflow-y-auto">
            {availabilityData.map((slot, index) => (
              <div
                key={`timeline-slot-${slot.start}-${index}`}
                className={cn(
                  'flex items-center p-3 rounded-lg border transition-colors',
                  slot.availabilityPercentage === 100
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : slot.availabilityPercentage >= 50
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700',
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatTime(slot.start)} - {formatTime(slot.end)}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {slot.freeCalendars}/{slot.totalCalendars} free
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all',
                        slot.availabilityPercentage === 100
                          ? 'bg-green-500 dark:bg-green-400'
                          : slot.availabilityPercentage >= 50
                            ? 'bg-yellow-500 dark:bg-yellow-400'
                            : 'bg-red-500 dark:bg-red-400',
                      )}
                      style={{ width: `${slot.availabilityPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Details */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
          📋 Calendar Details
        </h4>
        <div className="space-y-2">
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div
                role="button"
                tabIndex={0}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCalendarExpansion(calendar.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleCalendarExpansion(calendar.id);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {calendar.busy.length === 0 ? (
                      <CheckCircleIcon className="size-5 text-green-500 dark:text-green-400" />
                    ) : (
                      <XCircleIcon className="size-5 text-red-500 dark:text-red-400" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {calendar.id === 'primary'
                        ? 'Primary Calendar'
                        : calendar.id}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {calendar.busy.length} busy period
                    {calendar.busy.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {expandedCalendars.has(calendar.id) ? (
                  <ChevronUpIcon className="size-5 text-gray-400 dark:text-gray-500" />
                ) : (
                  <ChevronDownIcon className="size-5 text-gray-400 dark:text-gray-500" />
                )}
              </div>

              {expandedCalendars.has(calendar.id) && (
                <div className="mt-3 space-y-2">
                  {calendar.busy.length === 0 ? (
                    <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      ✅ Completely free during this time period
                    </div>
                  ) : (
                    calendar.busy.map((period, index) => (
                      <div
                        key={`busy-period-${period.start}-${index}`}
                        className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <XCircleIcon className="size-4 text-red-500 dark:text-red-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatDate(period.start)}{' '}
                            {formatTime(period.start)} -{' '}
                            {formatTime(period.end)}
                          </span>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">
                          {getDuration(period.start, period.end)} min
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FreeBusyError: React.FC<{
  error: string;
  input?: { timeMin?: string; timeMax?: string; calendarIds?: string[] };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}> = ({ error, input, onAction }) => {
  const handleRetry = () => {
    onAction?.({
      action: 'retry_freebusy',
      data: {
        timeMin: input?.timeMin,
        timeMax: input?.timeMax,
        calendarIds: input?.calendarIds,
      },
    });
  };

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-4xl">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-red-100 dark:bg-red-900 rounded-lg p-2">
          <UsersIcon className="size-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-red-800 dark:text-red-300">
            Error Loading Free/Busy Information
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
      </div>
    </div>
  );
};
