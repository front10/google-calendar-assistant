import { tool } from 'ai';
import { z } from 'zod';
import type { UpdateEventInput, UpdateEventOutput } from '../types';

export const updateEvent = tool({
  description: 'Update an existing calendar event with new information',
  inputSchema: z.object({
    eventId: z.string().describe('ID of the event to update'),
    updates: z
      .object({
        title: z.string().optional().describe('New title for the event'),
        description: z
          .string()
          .optional()
          .describe('New description for the event'),
        startDate: z
          .string()
          .optional()
          .describe('New start date and time in ISO format'),
        endDate: z
          .string()
          .optional()
          .describe('New end date and time in ISO format'),
        allDay: z
          .boolean()
          .optional()
          .describe('Whether the event is an all-day event'),
        location: z.string().optional().describe('New location for the event'),
        attendees: z
          .array(z.string().email())
          .optional()
          .describe('New list of attendee email addresses'),
        color: z
          .enum(['blue', 'green', 'red', 'yellow', 'purple', 'orange'])
          .optional()
          .describe('New color theme for the event'),
        priority: z
          .enum(['low', 'medium', 'high'])
          .optional()
          .describe('New priority level of the event'),
        status: z
          .enum(['pending', 'confirmed', 'cancelled'])
          .optional()
          .describe('New status of the event'),
        recurring: z
          .object({
            type: z
              .enum(['daily', 'weekly', 'monthly', 'yearly'])
              .describe('Type of recurrence'),
            interval: z
              .number()
              .min(1)
              .describe('Interval between occurrences'),
            endAfter: z
              .number()
              .optional()
              .describe('Number of occurrences before ending'),
            endDate: z
              .string()
              .optional()
              .describe('End date for recurring events'),
          })
          .optional()
          .describe('New recurring event configuration'),
      })
      .describe('Updates to apply to the event'),
  }),
  execute: async (input: UpdateEventInput): Promise<UpdateEventOutput> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // In a real implementation, this would fetch the event from your database
      // For now, we'll simulate an existing event
      const existingEvent = {
        id: input.eventId,
        title: 'Existing Event',
        description: 'This is an existing event',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        allDay: false,
        location: 'Default Location',
        attendees: [],
        color: 'blue' as const,
        priority: 'medium' as const,
        status: 'confirmed' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Validate date changes if provided
      if (input.updates.startDate || input.updates.endDate) {
        const newStartDate = input.updates.startDate
          ? new Date(input.updates.startDate)
          : new Date(existingEvent.startDate);
        const newEndDate = input.updates.endDate
          ? new Date(input.updates.endDate)
          : new Date(existingEvent.endDate);

        if (newStartDate >= newEndDate) {
          throw new Error('Start date must be before end date');
        }
      }

      // Apply updates
      const updatedEvent = {
        ...existingEvent,
        ...input.updates,
        updatedAt: new Date().toISOString(),
      };

      // In a real implementation, this would update your database
      // console.log('Updating event:', updatedEvent);

      return {
        event: updatedEvent,
        message: `Event "${updatedEvent.title}" updated successfully`,
      };
    } catch (error) {
      throw new Error(
        `Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  },
});
