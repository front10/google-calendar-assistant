import { tool } from 'ai';
import { createGoogleCalendarClient } from './client';
import {
  GetGoogleCalendarFreeBusyInputSchema,
  type GetGoogleCalendarFreeBusyInput,
  type GetGoogleCalendarFreeBusyOutput,
} from './types';

export const getGoogleCalendarFreeBusy = (googleTokens?: {
  accessToken?: string;
  refreshToken?: string;
}) =>
  tool({
    description:
      'Get free/busy information for Google Calendars. This tool helps users check availability across multiple calendars and find optimal meeting times. It shows when calendars are busy (have events) and when they are free.',
    inputSchema: GetGoogleCalendarFreeBusyInputSchema,
    execute: async (
      input: GetGoogleCalendarFreeBusyInput,
    ): Promise<GetGoogleCalendarFreeBusyOutput> => {
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

        const freeBusyData = await client.getFreeBusy({
          timeMin: input.timeMin,
          timeMax: input.timeMax,
          calendarIds: input.calendarIds,
          groupExpansionMax: input.groupExpansionMax,
          timeZone: input.timeZone,
        });

        // Transform the response to match our schema
        const calendars = Object.entries(freeBusyData.calendars || {}).map(
          ([calendarId, calendarData]: [string, any]) => ({
            id: calendarId,
            busy: calendarData.busy || [],
          }),
        );

        const timeMin = new Date(input.timeMin).toLocaleDateString();
        const timeMax = new Date(input.timeMax).toLocaleDateString();
        const calendarCount = calendars.length;
        const totalBusyPeriods = calendars.reduce(
          (sum, cal) => sum + cal.busy.length,
          0,
        );

        return {
          calendars,
          groups: freeBusyData.groups,
          timeMin: input.timeMin,
          timeMax: input.timeMax,
          summary: `Free/busy information for ${calendarCount} calendar${
            calendarCount !== 1 ? 's' : ''
          } from ${timeMin} to ${timeMax}. Found ${totalBusyPeriods} busy period${
            totalBusyPeriods !== 1 ? 's' : ''
          }.`,
        };
      } catch (error) {
        console.error('Error in getGoogleCalendarFreeBusy:', error);
        throw error;
      }
    },
  });
