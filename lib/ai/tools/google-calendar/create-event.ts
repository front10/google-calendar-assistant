import { tool } from 'ai';
import { createGoogleCalendarClient } from './client';
import {
  CreateGoogleCalendarEventInputSchema,
  type CreateGoogleCalendarEventInput,
  type CreateGoogleCalendarEventOutput,
} from './types';

export const createGoogleCalendarEvent = (googleTokens?: {
  accessToken?: string;
  refreshToken?: string;
}) =>
  tool({
    description:
      'Create a new event in a Google Calendar. This tool allows users to create calendar events with details like title, description, start/end times, location, attendees, and more.',
    inputSchema: CreateGoogleCalendarEventInputSchema,
    execute: async (
      input: CreateGoogleCalendarEventInput,
    ): Promise<CreateGoogleCalendarEventOutput> => {
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
        const createdEvent = await client.createEvent(
          input.calendarId || 'primary',
          {
            summary: input.summary,
            description: input.description,
            start: input.start,
            end: input.end,
            location: input.location,
            attendees: input.attendees,
            recurrence: input.recurrence,
          },
        );

        return {
          message: 'Event created successfully',
          event: {
            id: createdEvent.id || '',
            summary: createdEvent.summary || 'No Title',
            description: createdEvent.description || '',
            start: {
              dateTime: createdEvent.start?.dateTime || '',
              date: createdEvent.start?.date || '',
              timeZone: createdEvent.start?.timeZone || 'UTC',
            },
            end: {
              dateTime: createdEvent.end?.dateTime || '',
              date: createdEvent.end?.date || '',
              timeZone: createdEvent.end?.timeZone || 'UTC',
            },
            location: createdEvent.location || '',
            attendees:
              createdEvent.attendees?.map((attendee: any) => ({
                email: attendee.email || '',
                displayName: attendee.displayName || '',
                responseStatus: attendee.responseStatus || 'needsAction',
              })) || [],
            recurrence: createdEvent.recurrence || [],
            status: createdEvent.status || 'confirmed',
            created: createdEvent.created || '',
            updated: createdEvent.updated || '',
          },
        };
      } catch (error) {
        console.error('Error in createGoogleCalendarEvent:', error);
        throw error;
      }
    },
  });
