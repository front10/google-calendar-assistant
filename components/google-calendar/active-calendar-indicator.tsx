'use client';

import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface ActiveCalendarIndicatorProps {
  calendarName?: string;
  calendarId?: string;
  isPrimary?: boolean;
  onCalendarChange?: () => void;
  className?: string;
}

export const ActiveCalendarIndicator: React.FC<
  ActiveCalendarIndicatorProps
> = ({
  calendarName = 'No calendar selected',
  calendarId,
  isPrimary = false,
  onCalendarChange,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => {
          setIsExpanded(!isExpanded);
          onCalendarChange?.();
        }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
          'hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
          calendarId
            ? 'border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400',
        )}
      >
        <CalendarIcon className="w-4 h-4" />
        <span className="text-sm font-medium truncate max-w-[200px]">
          {calendarName}
        </span>
        {isPrimary && (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
            Primary
          </span>
        )}
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
          <div className="p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Current Calendar
            </p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {calendarName}
              </span>
            </div>
            {calendarId && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ID: {calendarId}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                onCalendarChange?.();
              }}
              className="mt-2 w-full text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-center"
            >
              Change Calendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook para manejar el estado del calendario activo
export const useActiveCalendar = () => {
  const [activeCalendar, setActiveCalendar] = useState<{
    id?: string;
    name?: string;
    isPrimary?: boolean;
  }>({});

  const setActiveCalendarData = (calendar: {
    id?: string;
    name?: string;
    isPrimary?: boolean;
  }) => {
    setActiveCalendar(calendar);
  };

  const clearActiveCalendar = () => {
    setActiveCalendar({});
  };

  return {
    activeCalendar,
    setActiveCalendarData,
    clearActiveCalendar,
  };
};
