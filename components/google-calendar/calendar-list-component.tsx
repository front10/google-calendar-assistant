'use client';

import { useState } from 'react';
import {
  CalendarIcon,
  CheckIcon,
  StarIcon,
  UsersIcon,
  SettingsIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  GoogleCalendarList,
  GetGoogleCalendarListOutput,
} from '@/lib/ai/tools/google-calendar/types';

export interface CalendarListComponentProps {
  output: GetGoogleCalendarListOutput;
  input?: {
    minAccessRole?: string;
  };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}

export const CalendarListLoading: React.FC<{
  input?: { minAccessRole?: string };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}> = ({ input: _input, onAction: _onAction }) => {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg size-10" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={`skeleton-${i}-${Date.now()}`}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="size-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CalendarListComponent: React.FC<CalendarListComponentProps> = ({
  output,
  input,
  onAction,
}) => {
  const { calendars, primaryCalendar, message } = output;
  const [selectedCalendar, setSelectedCalendar] =
    useState<GoogleCalendarList | null>(null);

  // Get access role color
  const getAccessRoleColor = (accessRole: string) => {
    switch (accessRole) {
      case 'owner':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'writer':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'reader':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'freeBusyReader':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  // Get access role icon
  const getAccessRoleIcon = (accessRole: string) => {
    switch (accessRole) {
      case 'owner':
        return <StarIcon className="size-4" />;
      case 'writer':
        return <SettingsIcon className="size-4" />;
      case 'reader':
        return <UsersIcon className="size-4" />;
      case 'freeBusyReader':
        return <CalendarIcon className="size-4" />;
      default:
        return <CalendarIcon className="size-4" />;
    }
  };

  // Action handlers
  const handleSelectCalendar = (calendar: GoogleCalendarList) => {
    setSelectedCalendar(calendar);
    onAction?.({
      action: 'select_calendar',
      data: {
        calendarId: calendar.id,
        calendarName: calendar.summary,
        accessRole: calendar.accessRole,
      },
    });
  };

  const handleViewCalendarEvents = (calendar: GoogleCalendarList) => {
    onAction?.({
      action: 'view_calendar_events',
      data: {
        calendarId: calendar.id,
        calendarName: calendar.summary,
      },
    });
  };

  const handleRefreshCalendars = () => {
    onAction?.({
      action: 'refresh_calendar_list',
      data: {
        minAccessRole: input?.minAccessRole,
      },
    });
  };

  const handleManageCalendar = (calendar: GoogleCalendarList) => {
    onAction?.({
      action: 'manage_calendar',
      data: {
        calendarId: calendar.id,
        calendarName: calendar.summary,
        accessRole: calendar.accessRole,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
            <CalendarIcon className="size-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Google Calendars
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRefreshCalendars}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCwIcon className="size-4" />
          Refresh
        </button>
      </div>

      {/* Primary Calendar Highlight */}
      {primaryCalendar && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">
                <StarIcon className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-300">
                  Primary Calendar
                </h4>
                <p className="text-blue-800 dark:text-blue-400">
                  {primaryCalendar.summary}
                </p>
                {primaryCalendar.description && (
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {primaryCalendar.description}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectCalendar(primaryCalendar)}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Select
            </button>
          </div>
        </div>
      )}

      {/* Calendars List */}
      <div className="space-y-3">
        {calendars.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CalendarIcon className="size-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No calendars found</p>
            <p className="text-sm">
              Make sure you have access to at least one calendar
            </p>
          </div>
        ) : (
          calendars.map((calendar) => (
            <div
              key={calendar.id}
              role="button"
              tabIndex={0}
              className={cn(
                'border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer',
                selectedCalendar?.id === calendar.id
                  ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500',
              )}
              onClick={() => handleSelectCalendar(calendar)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectCalendar(calendar);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="size-4 rounded-full"
                    style={{
                      backgroundColor: calendar.backgroundColor || '#3b82f6',
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {calendar.summary}
                      </h4>
                      {calendar.primary && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                          Primary
                        </span>
                      )}
                      {calendar.selected && (
                        <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>

                    {calendar.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {calendar.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                          getAccessRoleColor(calendar.accessRole),
                        )}
                      >
                        {getAccessRoleIcon(calendar.accessRole)}
                        {calendar.accessRole}
                      </span>

                      {calendar.timeZone && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {calendar.timeZone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewCalendarEvents(calendar);
                    }}
                    className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    View Events
                  </button>

                  {calendar.accessRole === 'owner' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleManageCalendar(calendar);
                      }}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Manage Calendar"
                    >
                      <SettingsIcon className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Calendar Info */}
      {selectedCalendar && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            Selected Calendar
          </h4>
          <div className="flex items-center gap-2">
            <div
              className="size-3 rounded-full"
              style={{
                backgroundColor: selectedCalendar.backgroundColor || '#3b82f6',
              }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedCalendar.summary} ({selectedCalendar.accessRole})
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            You can now use this calendar for creating, viewing, and managing
            events.
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
          How to use
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Click on a calendar to select it for event operations</li>
          <li>
            • Use &quot;View Events&quot; to see events in a specific calendar
          </li>
          <li>• Only calendars you own can be managed</li>
          <li>• The primary calendar is highlighted for easy identification</li>
        </ul>
      </div>
    </div>
  );
};

export const CalendarListError: React.FC<{
  error: string;
  input?: { minAccessRole?: string };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}> = ({ error, input, onAction }) => {
  const handleRetry = () => {
    onAction?.({
      action: 'retry_load_calendar_list',
      data: {
        minAccessRole: input?.minAccessRole,
      },
    });
  };

  const handleRefresh = () => {
    onAction?.({
      action: 'refresh_calendar_list',
      data: { minAccessRole: input?.minAccessRole },
    });
  };

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-red-100 dark:bg-red-900 rounded-lg p-2">
          <CalendarIcon className="size-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="font-semibold text-red-800 dark:text-red-300">
            Error Loading Calendar List
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
