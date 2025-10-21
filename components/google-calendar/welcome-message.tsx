'use client';

import {
  CalendarIcon,
  PlusIcon,
  ListIcon,
  SettingsIcon,
  ClockIcon,
  UsersIcon,
} from 'lucide-react';

export const GoogleCalendarWelcomeMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mb-6">
        <CalendarIcon className="size-12 text-blue-600 dark:text-blue-400" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Welcome to Front10 Calendar Assistant
      </h1>
      <p className="text-1xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        by front10.com
      </p>

      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
        Your intelligent calendar management companion. I can help you view,
        create, edit, manage your Google Calendar events, and check availability
        across multiple calendars with ease.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-600">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 w-fit mx-auto mb-4">
            <ListIcon className="size-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            View Calendars
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            See all your available Google Calendars and select which one to work
            with
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-600">
          <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 w-fit mx-auto mb-4">
            <PlusIcon className="size-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Create Events
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add new events with details like time, location, attendees, and
            descriptions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-600">
          <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 w-fit mx-auto mb-4">
            <SettingsIcon className="size-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Manage Events
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Edit existing events, update details, or remove events you no longer
            need
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-600">
          <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 w-fit mx-auto mb-4">
            <ClockIcon className="size-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Smart Scheduling
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get help with scheduling, time conflicts, and recurring events
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-600">
          <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 w-fit mx-auto mb-4">
            <UsersIcon className="size-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Free/Busy Check
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check availability across multiple calendars and find optimal
            meeting times
          </p>
        </div>
      </div>
    </div>
  );
};
