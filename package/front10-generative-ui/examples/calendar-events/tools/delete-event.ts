import { tool } from 'ai';
import { z } from 'zod';
import type { DeleteEventInput, DeleteEventOutput } from '../types';

export const deleteEvent = tool({
  description:
    'Delete a calendar event, optionally including all recurring instances',
  inputSchema: z.object({
    eventId: z.string().describe('ID of the event to delete'),
    deleteRecurring: z
      .boolean()
      .optional()
      .default(false)
      .describe('If true, delete all recurring instances of this event'),
  }),
  execute: async (input: DeleteEventInput): Promise<DeleteEventOutput> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      // In a real implementation, this would fetch the event from your database
      // For now, we'll simulate an existing event
      const eventToDelete = {
        id: input.eventId,
        title: 'Event to Delete',
        description: 'This event will be deleted',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        allDay: false,
        location: 'Some Location',
        attendees: [],
        color: 'red' as const,
        priority: 'medium' as const,
        status: 'confirmed' as const,
        recurring: {
          type: 'weekly' as const,
          interval: 1,
          endAfter: 10,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real implementation, this would delete from your database
      // console.log('Deleting event:', eventToDelete);
      // console.log('Delete recurring instances:', input.deleteRecurring);

      return {
        deletedEvent: eventToDelete,
        message: input.deleteRecurring
          ? `Event "${eventToDelete.title}" and all recurring instances deleted successfully`
          : `Event "${eventToDelete.title}" deleted successfully`,
      };
    } catch (error) {
      throw new Error(
        `Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  },
});
