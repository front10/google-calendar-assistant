import { tool } from 'ai';
import { createGoogleCalendarClient } from './client';
import {
  DeleteGoogleCalendarEventInputSchema,
  type DeleteGoogleCalendarEventInput,
  type DeleteGoogleCalendarEventOutput,
} from './types';

export const deleteGoogleCalendarEvent = (googleTokens?: {
  accessToken?: string;
  refreshToken?: string;
}) =>
  tool({
    description:
      'Delete an event from a Google Calendar. This tool allows users to remove calendar events. Use with caution as this action cannot be undone.',
    inputSchema: DeleteGoogleCalendarEventInputSchema,
    execute: async (
      input: DeleteGoogleCalendarEventInput,
    ): Promise<DeleteGoogleCalendarEventOutput> => {
      try {
        if (!googleTokens?.accessToken) {
          throw new Error(
            'No Google access token available. Please connect your Google account first.',
          );
        }

        const client = createGoogleCalendarClient({
          accessToken: googleTokens.accessToken as string,
          refreshToken: googleTokens.refreshToken,
        });
        await client.deleteEvent(input.calendarId || 'primary', input.eventId);

        return {
          message: 'Event deleted successfully',
          deletedEventId: input.eventId,
        };
      } catch (error) {
        console.error('Error in deleteGoogleCalendarEvent:', error);
        throw error;
      }
    },
  });
