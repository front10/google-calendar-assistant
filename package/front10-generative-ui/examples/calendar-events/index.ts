// Export types
export type {
  CalendarEvent,
  CalendarView,
  EventFilter,
  CalendarState,
  GetEventsInput,
  GetEventsOutput,
  CreateEventInput,
  CreateEventOutput,
  UpdateEventInput,
  UpdateEventOutput,
  DeleteEventInput,
  DeleteEventOutput,
  CalendarAction,
} from './types';

// Export store
export { useCalendarStore } from './store';

// Import tools
import { getEvents } from './tools/get-events';
import { createEvent } from './tools/create-event';
import { updateEvent } from './tools/update-event';
import { deleteEvent } from './tools/delete-event';

// Import components
import {
  CalendarComponent,
  CalendarLoading,
  CalendarError,
} from './components/calendar';

// Export tools
export { getEvents, createEvent, updateEvent, deleteEvent };

// Export components
export { CalendarComponent, CalendarLoading, CalendarError };

// Export example registration
export const calendarEventsExample = {
  toolId: 'getEvents',
  tool: getEvents,
  components: {
    LoadingComponent: CalendarLoading,
    SuccessComponent: CalendarComponent,
    ErrorComponent: CalendarError,
  },
};

// Export all tools for easy access
export const calendarTools = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
