import { tool } from 'ai';
import { z } from 'zod';
import type { GetEventsInput, GetEventsOutput } from '../types';

export const getEvents = tool({
  description:
    'Get calendar events for a specific date range with optional filters',
  inputSchema: z.object({
    startDate: z
      .string()
      .optional()
      .describe('Start date in ISO format (YYYY-MM-DD)'),
    endDate: z
      .string()
      .optional()
      .describe('End date in ISO format (YYYY-MM-DD)'),
    filters: z
      .object({
        search: z
          .string()
          .optional()
          .describe('Search term to filter events by title or description'),
        status: z
          .enum(['pending', 'confirmed', 'cancelled'])
          .optional()
          .describe('Filter by event status'),
        priority: z
          .enum(['low', 'medium', 'high'])
          .optional()
          .describe('Filter by event priority'),
        color: z
          .enum(['blue', 'green', 'red', 'yellow', 'purple', 'orange'])
          .optional()
          .describe('Filter by event color'),
      })
      .optional()
      .describe('Additional filters to apply'),
  }),
  execute: async (input: GetEventsInput): Promise<GetEventsOutput> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real implementation, this would call your calendar API
      // For now, we'll return mock data
      const mockEvents = [
        {
          id: '1',
          title: 'Reunión de equipo',
          description: 'Revisión semanal del proyecto',
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(
            Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
          ).toISOString(),
          allDay: false,
          location: 'Sala de conferencias A',
          attendees: ['john@example.com', 'jane@example.com'],
          color: 'blue' as const,
          priority: 'high' as const,
          status: 'confirmed' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Cumpleaños de María',
          description: 'Celebración del cumpleaños',
          startDate: new Date(
            Date.now() + 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          allDay: true,
          color: 'green' as const,
          priority: 'medium' as const,
          status: 'confirmed' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Standup diario',
          description: 'Reunión diaria del equipo',
          startDate: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          endDate: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000,
          ).toISOString(),
          allDay: false,
          color: 'purple' as const,
          priority: 'low' as const,
          status: 'confirmed' as const,
          recurring: {
            type: 'daily' as const,
            interval: 1,
            endAfter: 5,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Apply filters if provided
      let filteredEvents = mockEvents;

      if (input.filters?.search) {
        const searchTerm = input.filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(
          (event) =>
            event.title.toLowerCase().includes(searchTerm) ||
            event.description?.toLowerCase().includes(searchTerm),
        );
      }

      const filters = input.filters;
      if (filters?.status) {
        filteredEvents = filteredEvents.filter(
          (event) => event.status === filters.status,
        );
      }

      if (filters?.priority) {
        filteredEvents = filteredEvents.filter(
          (event) => event.priority === filters.priority,
        );
      }

      if (filters?.color) {
        filteredEvents = filteredEvents.filter(
          (event) => event.color === filters.color,
        );
      }

      // Apply date range filter
      if (input.startDate || input.endDate) {
        const startDate = input.startDate
          ? new Date(input.startDate)
          : new Date(0);
        const endDate = input.endDate
          ? new Date(input.endDate)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

        filteredEvents = filteredEvents.filter((event) => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate);
          return eventStart <= endDate && eventEnd >= startDate;
        });
      }

      const view = {
        type: 'month' as const,
        startDate: input.startDate || new Date().toISOString(),
        endDate:
          input.endDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        events: filteredEvents,
      };

      return {
        events: filteredEvents,
        total: filteredEvents.length,
        view,
      };
    } catch (error) {
      throw new Error(
        `Failed to get events: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  },
});
