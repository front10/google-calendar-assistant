export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  allDay: boolean;
  location?: string;
  attendees?: string[];
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'confirmed' | 'cancelled';
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endAfter?: number; // number of occurrences
    endDate?: string; // ISO string
  };
  createdAt: string;
  updatedAt: string;
}

export interface CalendarView {
  type: 'month' | 'week' | 'day';
  startDate: string; // ISO string
  endDate: string; // ISO string
  events: CalendarEvent[];
}

export interface EventFilter {
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: CalendarEvent['status'];
  priority?: CalendarEvent['priority'];
  color?: CalendarEvent['color'];
}

export interface CalendarState {
  currentView: CalendarView;
  selectedEvent?: CalendarEvent;
  filters: EventFilter;
  isLoading: boolean;
  error?: string;
}

// Tool input/output types
export interface GetEventsInput {
  startDate?: string;
  endDate?: string;
  filters?: EventFilter;
}

export interface GetEventsOutput {
  events: CalendarEvent[];
  total: number;
  view: CalendarView;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  color?: CalendarEvent['color'];
  priority?: CalendarEvent['priority'];
  recurring?: CalendarEvent['recurring'];
}

export interface CreateEventOutput {
  event: CalendarEvent;
  message: string;
}

export interface UpdateEventInput {
  eventId: string;
  updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>>;
}

export interface UpdateEventOutput {
  event: CalendarEvent;
  message: string;
}

export interface DeleteEventInput {
  eventId: string;
  deleteRecurring?: boolean; // if true, delete all recurring instances
}

export interface DeleteEventOutput {
  deletedEvent: CalendarEvent;
  message: string;
}

export interface CalendarAction {
  type: 'view' | 'create' | 'update' | 'delete';
  payload: any;
  timestamp: string;
}
