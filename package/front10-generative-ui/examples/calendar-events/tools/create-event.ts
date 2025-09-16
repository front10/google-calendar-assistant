import { tool } from 'ai';
import { z } from 'zod';
import type { CreateEventInput, CreateEventOutput } from '../types';

export const createEvent = tool({
  description:
    'Create a new calendar event with optional recurring configuration',
  inputSchema: z.object({
    title: z.string().describe('Title of the event'),
    description: z.string().optional().describe('Description of the event'),
    startDate: z.string().describe('Start date and time in ISO format'),
    endDate: z
      .string()
      .optional()
      .describe(
        'End date and time in ISO format. If not provided, will be set to startDate + 1 hour',
      ),
    allDay: z
      .boolean()
      .optional()
      .default(false)
      .describe('Whether the event is an all-day event'),
    location: z.string().optional().describe('Location of the event'),
    attendees: z
      .array(z.string().email())
      .optional()
      .describe('List of attendee email addresses'),
    color: z
      .enum(['blue', 'green', 'red', 'yellow', 'purple', 'orange'])
      .optional()
      .describe('Color theme for the event'),
    priority: z
      .enum(['low', 'medium', 'high'])
      .optional()
      .default('medium')
      .describe('Priority level of the event'),
    recurring: z
      .object({
        type: z
          .enum(['daily', 'weekly', 'monthly', 'yearly'])
          .describe('Type of recurrence'),
        interval: z.number().min(1).describe('Interval between occurrences'),
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
      .describe('Recurring event configuration'),
  }),
  execute: async (input: CreateEventInput): Promise<CreateEventOutput> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Validate input
      const startDate = new Date(input.startDate);
      const endDate = input.endDate
        ? new Date(input.endDate)
        : new Date(startDate.getTime() + 60 * 60 * 1000);

      if (startDate >= endDate) {
        throw new Error('Start date must be before end date');
      }

      // Generate unique ID
      const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create the event
      const event = {
        id: eventId,
        title: input.title,
        description: input.description,
        startDate: input.startDate,
        endDate: endDate.toISOString(),
        allDay: input.allDay || false,
        location: input.location,
        attendees: input.attendees || [],
        color: input.color || 'blue',
        priority: input.priority || 'medium',
        status: 'confirmed' as const,
        recurring: input.recurring,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real implementation, this would save to your database
      // console.log('Creating event:', event);

      return {
        event,
        message: `Event "${input.title}" created successfully for ${new Date(input.startDate).toLocaleDateString()}`,
      };
    } catch (error) {
      throw new Error(
        `Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  },
});
