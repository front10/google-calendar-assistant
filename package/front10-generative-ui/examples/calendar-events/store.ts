import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  CalendarEvent,
  CalendarView,
  EventFilter,
  CalendarState,
  CalendarAction,
} from './types';

interface CalendarStore extends CalendarState {
  // Actions
  setCurrentView: (view: CalendarView) => void;
  setSelectedEvent: (event?: CalendarEvent) => void;
  setFilters: (filters: EventFilter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;

  // Event actions
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (eventId: string) => void;
  replaceEvents: (events: CalendarEvent[]) => void;

  // Calendar actions
  addAction: (action: CalendarAction) => void;
  clearActions: () => void;

  // Computed
  getEventsForDate: (date: string) => CalendarEvent[];
  getEventsForRange: (startDate: string, endDate: string) => CalendarEvent[];

  // Actions history
  actions: CalendarAction[];
}

// Mock data for demonstration
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Reunión de equipo',
    description: 'Revisión semanal del proyecto',
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endDate: new Date(
      Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
    ).toISOString(), // Tomorrow + 1 hour
    allDay: false,
    location: 'Sala de conferencias A',
    attendees: ['john@example.com', 'jane@example.com'],
    color: 'blue',
    priority: 'high',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Cumpleaños de María',
    description: 'Celebración del cumpleaños',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    allDay: true,
    color: 'green',
    priority: 'medium',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Standup diario',
    description: 'Reunión diaria del equipo',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000,
    ).toISOString(),
    allDay: false,
    color: 'purple',
    priority: 'low',
    status: 'confirmed',
    recurring: {
      type: 'daily',
      interval: 1,
      endAfter: 5,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useCalendarStore = create<CalendarStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentView: {
        type: 'month',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        events: mockEvents,
      },
      selectedEvent: undefined,
      filters: {},
      isLoading: false,
      error: undefined,
      actions: [],

      // Actions
      setCurrentView: (view) =>
        set((state) => ({
          currentView: { ...view, events: state.currentView.events },
        })),

      setSelectedEvent: (event) => set({ selectedEvent: event }),

      setFilters: (filters) => set({ filters }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // Event actions
      addEvent: (event) =>
        set((state) => ({
          currentView: {
            ...state.currentView,
            events: [...state.currentView.events, event],
          },
        })),

      updateEvent: (eventId, updates) =>
        set((state) => ({
          currentView: {
            ...state.currentView,
            events: state.currentView.events.map((event) =>
              event.id === eventId
                ? { ...event, ...updates, updatedAt: new Date().toISOString() }
                : event,
            ),
          },
          selectedEvent:
            state.selectedEvent?.id === eventId
              ? {
                  ...state.selectedEvent,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : state.selectedEvent,
        })),

      deleteEvent: (eventId) =>
        set((state) => ({
          currentView: {
            ...state.currentView,
            events: state.currentView.events.filter(
              (event) => event.id !== eventId,
            ),
          },
          selectedEvent:
            state.selectedEvent?.id === eventId
              ? undefined
              : state.selectedEvent,
        })),

      replaceEvents: (events) =>
        set((state) => ({
          currentView: {
            ...state.currentView,
            events,
          },
        })),

      // Calendar actions
      addAction: (action) =>
        set((state) => ({
          actions: [...state.actions, action],
        })),

      clearActions: () => set({ actions: [] }),

      // Computed
      getEventsForDate: (date) => {
        const state = get();
        const targetDate = new Date(date);
        return state.currentView.events.filter((event) => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate);
          return eventStart <= targetDate && eventEnd >= targetDate;
        });
      },

      getEventsForRange: (startDate, endDate) => {
        const state = get();
        const rangeStart = new Date(startDate);
        const rangeEnd = new Date(endDate);
        return state.currentView.events.filter((event) => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate);
          return eventStart <= rangeEnd && eventEnd >= rangeStart;
        });
      },
    }),
    {
      name: 'calendar-store',
    },
  ),
);
