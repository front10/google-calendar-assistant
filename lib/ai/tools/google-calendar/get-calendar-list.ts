import { tool } from 'ai';
import { createGoogleCalendarClient } from './client';
import {
  GetGoogleCalendarListInputSchema,
  type GetGoogleCalendarListInput,
  type GetGoogleCalendarListOutput,
} from './types';

export const getGoogleCalendarList = (googleTokens?: {
  accessToken?: string;
  refreshToken?: string;
}) =>
  tool({
    description:
      'Get list of available Google Calendars for the authenticated user. This tool helps users see all their calendars and select which one to work with.',
    inputSchema: GetGoogleCalendarListInputSchema,
    execute: async (
      input: GetGoogleCalendarListInput,
    ): Promise<GetGoogleCalendarListOutput> => {
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
        const calendars = await client.getCalendarList();

        return {
          message: `Found ${calendars.length} calendars`,
          calendars: calendars.map((calendar: any) => ({
            id: calendar.id || '',
            summary: calendar.summary || 'Untitled Calendar',
            description: calendar.description || '',
            timeZone: calendar.timeZone || 'UTC',
            accessRole: calendar.accessRole || 'reader',
            primary: calendar.primary || false,
            backgroundColor: calendar.backgroundColor || '#ffffff',
            foregroundColor: calendar.foregroundColor || '#000000',
          })),
        };
      } catch (error) {
        console.error('Error in getGoogleCalendarList:', error);
        throw error;
      }
    },
  });
