'use client';

import { useGoogleAuth } from '@/hooks/use-google-auth';
import { GoogleConnectButton } from './google-connect-button';
import { CalendarIcon, CheckCircleIcon } from 'lucide-react';

export function GoogleStatusIndicator() {
  const { isAuthenticated, email, isLoading, connectGoogle, disconnectGoogle } =
    useGoogleAuth();

  if (isLoading) {
    return (
      <div className="mx-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="size-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Checking Google Calendar connection...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="mx-4 mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="size-4 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Google Calendar Connected
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={disconnectGoogle}
            className="text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <CalendarIcon className="size-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            Connect to Google Calendar
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
            To use Google Calendar features like viewing events, creating
            meetings, and managing your schedule, you need to connect your
            Google account.
          </p>
          <GoogleConnectButton
            className="text-sm py-2 px-4"
            onClick={connectGoogle}
          >
            <CalendarIcon className="size-4" />
            Connect Google Calendar
          </GoogleConnectButton>
        </div>
      </div>
    </div>
  );
}
