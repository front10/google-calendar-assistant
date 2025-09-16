'use client';

import { useState } from 'react';
import {
  CalendarIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  EyeIcon,
} from 'lucide-react';
import { cn } from '../../../src/utils';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  attendees?: string[];
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface CalendarProps {
  output: {
    events: CalendarEvent[];
    totalEvents: number;
    nextEvent?: CalendarEvent;
  };
  input?: {
    date?: string;
    userId?: string;
  };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}

export const CalendarLoading: React.FC<{
  input?: { date?: string; userId?: string };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}> = ({ input: _input, onAction: _onAction }) => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-6 max-w-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gray-200 rounded-lg size-10" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }, () => (
          <div
            key={`skeleton-${Math.random()}`}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CalendarComponent: React.FC<CalendarProps> = ({
  output,
  input: _input,
  onAction,
}) => {
  const { events, totalEvents, nextEvent } = output;
  // console.log('event length', events.length);
  // console.log('totalEvents', totalEvents);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const handleCreateEvent = () => {
    onAction?.({
      action: 'create_event',
      data: {
        userId: _input?.userId,
        date: _input?.date || new Date().toISOString().split('T')[0],
      },
    });
  };

  const handleEditEvent = (event: CalendarEvent) => {
    onAction?.({
      action: 'edit_event',
      data: {
        eventId: event.id,
        eventTitle: event.title,
        currentData: event,
      },
    });
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    onAction?.({
      action: 'delete_event',
      data: {
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  };

  const handleConfirmEvent = (event: CalendarEvent) => {
    onAction?.({
      action: 'confirm_event',
      data: {
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  };

  const handleCancelEvent = (event: CalendarEvent) => {
    onAction?.({
      action: 'cancel_event',
      data: {
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  };

  const handleViewEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onAction?.({
      action: 'view_event_details',
      data: {
        eventId: event.id,
        eventTitle: event.title,
      },
    });
  };

  const handleShareEvent = (event: CalendarEvent) => {
    onAction?.({
      action: 'share_event',
      data: {
        eventId: event.id,
        eventTitle: event.title,
        eventUrl: `${window.location.origin}/event/${event.id}`,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 rounded-lg p-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Calendar Events
            </h3>
            <p className="text-sm text-gray-500">{totalEvents} events found</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCreateEvent}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          New Event
        </button>
      </div>

      {/* Next Event Highlight */}
      {nextEvent && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Next Event</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">{nextEvent.title}</p>
              <p className="text-sm text-blue-600">
                {new Date(nextEvent.startDate).toLocaleDateString()} at{' '}
                {nextEvent.startDate.split('T')[1]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleViewEventDetails(nextEvent)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      {
                        'bg-yellow-100 text-yellow-800':
                          event.status === 'pending',
                        'bg-green-100 text-green-800':
                          event.status === 'confirmed',
                        'bg-red-100 text-red-800': event.status === 'cancelled',
                      },
                    )}
                  >
                    {event.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {event.description}
                </p>
                <div className="text-xs text-gray-500">
                  <p>
                    {new Date(event.startDate).toLocaleDateString()} -{' '}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>
                  {event.location && <p>📍 {event.location}</p>}
                </div>
              </div>

              {/* Event Actions */}
              <div className="flex items-center gap-1 ml-4">
                <button
                  type="button"
                  onClick={() => handleViewEventDetails(event)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="View Details"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleEditEvent(event)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit Event"
                >
                  <EditIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleShareEvent(event)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  title="Share Event"
                >
                  <span className="text-sm">📤</span>
                </button>

                {event.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleConfirmEvent(event)}
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      title="Confirm Event"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCancelEvent(event)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Cancel Event"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteEvent(event)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete Event"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedEvent.title}
            </h3>
            <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <p>Start: {new Date(selectedEvent.startDate).toLocaleString()}</p>
              <p>End: {new Date(selectedEvent.endDate).toLocaleString()}</p>
              {selectedEvent.location && (
                <p>Location: {selectedEvent.location}</p>
              )}
              {selectedEvent.attendees && (
                <p>Attendees: {selectedEvent.attendees.join(', ')}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleEditEvent(selectedEvent);
                  setSelectedEvent(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CalendarError: React.FC<{
  error: string;
  input?: { date?: string; userId?: string };
  onAction?: (action: { action: string; data?: any; context?: any }) => void;
}> = ({ error, input, onAction }) => {
  const handleRetry = () => {
    onAction?.({
      action: 'retry_load_events',
      data: {
        userId: input?.userId,
        date: input?.date,
      },
    });
  };

  const handleRefresh = () => {
    onAction?.({
      action: 'refresh_calendar',
      data: { userId: input?.userId },
    });
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-red-100 rounded-lg p-2">
          <CalendarIcon className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-red-800">Error Loading Calendar</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRetry}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};
