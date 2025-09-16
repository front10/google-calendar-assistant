import { tool } from 'ai';
import { createGoogleCalendarClient } from './client';
import {
  GetGoogleCalendarEventsInputSchema,
  type GetGoogleCalendarEventsInput,
  type GetGoogleCalendarEventsOutput,
} from './types';

export const getGoogleCalendarEvents = (googleTokens?: {
  accessToken?: string;
  refreshToken?: string;
}) =>
  tool({
    description:
      'Get events from a Google Calendar. By default, shows events for the current month if no date range is specified. This tool allows users to view their calendar events with various filtering options like date range, search terms, and calendar selection.',
    inputSchema: GetGoogleCalendarEventsInputSchema,
    execute: async (
      input: GetGoogleCalendarEventsInput,
    ): Promise<GetGoogleCalendarEventsOutput> => {
      try {
        if (!googleTokens?.accessToken) {
          throw new Error(
            'No Google access token available. Please connect your Google account first.',
          );
        }

        // Set default date range to current month if not specified
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // First day of current month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        // Last day of current month
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

        // Use current month as default if no dates specified
        const processedInput = {
          ...input,
          timeMin: input.timeMin || firstDayOfMonth.toISOString(),
          timeMax: input.timeMax || lastDayOfMonth.toISOString(),
        };

        // console.log('googleTokens', googleTokens);
        // console.log('input', { ...input });
        // console.log('processedInput with default dates', { ...processedInput });

        const client = createGoogleCalendarClient({
          accessToken: googleTokens.accessToken as string,
          refreshToken: googleTokens.refreshToken,
        });
        const { events } = await client.getEvents(processedInput);
        // console.log('events', { ...events });
        return {
          summary: `Found ${events.length} events`,
          events: events.map((event: any) => ({
            id: event.id || '',
            summary: event.summary || 'No Title',
            description: event.description || '',
            start: {
              dateTime: event.start?.dateTime || '',
              date: event.start?.date || '',
              timeZone: event.start?.timeZone || 'UTC',
            },
            end: {
              dateTime: event.end?.dateTime || '',
              date: event.end?.date || '',
              timeZone: event.end?.timeZone || 'UTC',
            },
            location: event.location || '',
            attendees:
              event.attendees?.map((attendee: any) => ({
                email: attendee.email || '',
                displayName: attendee.displayName || '',
                responseStatus: attendee.responseStatus || 'needsAction',
              })) || [],
            recurrence: event.recurrence || [],
            status: event.status || 'confirmed',
            created: event.created || '',
            updated: event.updated || '',
          })),
        };
      } catch (error) {
        console.error('Error in getGoogleCalendarEvents:', error);
        throw error;
      }
    },
  });
