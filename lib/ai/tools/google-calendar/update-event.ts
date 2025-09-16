import { tool } from 'ai';
import { createGoogleCalendarClient } from './client';
import {
  UpdateGoogleCalendarEventInputSchema,
  type UpdateGoogleCalendarEventInput,
  type UpdateGoogleCalendarEventOutput,
} from './types';

export const updateGoogleCalendarEvent = (googleTokens?: {
  accessToken?: string;
  refreshToken?: string;
}) =>
  tool({
    description:
      'Update an existing event in a Google Calendar. This tool allows users to modify calendar events by updating fields like title, description, start/end times, location, attendees, and more.',
    inputSchema: UpdateGoogleCalendarEventInputSchema,
    execute: async (
      input: UpdateGoogleCalendarEventInput,
    ): Promise<UpdateGoogleCalendarEventOutput> => {
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
        const updatedEvent = await client.updateEvent(
          input.calendarId || 'primary',
          input.eventId,
          {
            summary: input.updates.summary,
            description: input.updates.description,
            start: input.updates.start,
            end: input.updates.end,
            location: input.updates.location,
            attendees: input.updates.attendees,
            recurrence: input.updates.recurrence,
          },
        );

        return {
          message: 'Event updated successfully',
          event: {
            id: updatedEvent.id || '',
            summary: updatedEvent.summary || 'No Title',
            description: updatedEvent.description || '',
            start: {
              dateTime: updatedEvent.start?.dateTime || '',
              date: updatedEvent.start?.date || '',
              timeZone: updatedEvent.start?.timeZone || 'UTC',
            },
            end: {
              dateTime: updatedEvent.end?.dateTime || '',
              date: updatedEvent.end?.date || '',
              timeZone: updatedEvent.end?.timeZone || 'UTC',
            },
            location: updatedEvent.location || '',
            attendees:
              updatedEvent.attendees?.map((attendee: any) => ({
                email: attendee.email || '',
                displayName: attendee.displayName || '',
                responseStatus: attendee.responseStatus || 'needsAction',
              })) || [],
            recurrence: updatedEvent.recurrence || [],
            status: updatedEvent.status || 'confirmed',
            created: updatedEvent.created || '',
            updated: updatedEvent.updated || '',
          },
        };
      } catch (error) {
        console.error('Error in updateGoogleCalendarEvent:', error);
        throw error;
      }
    },
  });
