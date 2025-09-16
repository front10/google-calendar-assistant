import { z } from 'zod';

// Google Calendar Event Types
export const GoogleCalendarEventSchema = z.object({
  id: z.string().describe('Unique identifier for the event'),
  summary: z.string().describe('Title of the event'),
  description: z.string().optional().describe('Description of the event'),
  start: z
    .object({
      dateTime: z.string().optional().describe('Start time in RFC3339 format'),
      date: z
        .string()
        .optional()
        .describe('Start date in YYYY-MM-DD format for all-day events'),
      timeZone: z.string().optional().describe('Time zone of the event'),
    })
    .describe('Start time of the event'),
  end: z
    .object({
      dateTime: z.string().optional().describe('End time in RFC3339 format'),
      date: z
        .string()
        .optional()
        .describe('End date in YYYY-MM-DD format for all-day events'),
      timeZone: z.string().optional().describe('Time zone of the event'),
    })
    .describe('End time of the event'),
  location: z.string().optional().describe('Location of the event'),
  attendees: z
    .array(
      z.object({
        email: z.string().describe('Email address of the attendee'),
        displayName: z
          .string()
          .optional()
          .describe('Display name of the attendee'),
        responseStatus: z
          .enum(['needsAction', 'declined', 'tentative', 'accepted'])
          .optional()
          .describe('Response status of the attendee'),
      }),
    )
    .optional()
    .describe('List of attendees'),
  colorId: z.string().optional().describe('Color ID for the event'),
  status: z
    .enum(['confirmed', 'tentative', 'cancelled'])
    .optional()
    .describe('Status of the event'),
  visibility: z
    .enum(['default', 'public', 'private', 'confidential'])
    .optional()
    .describe('Visibility of the event'),
  recurrence: z
    .array(z.string())
    .optional()
    .describe('Recurrence rules for the event'),
  created: z.string().optional().describe('Creation time in RFC3339 format'),
  updated: z.string().optional().describe('Last update time in RFC3339 format'),
});

export type GoogleCalendarEvent = z.infer<typeof GoogleCalendarEventSchema>;

// Google Calendar List Types
export const GoogleCalendarListSchema = z.object({
  id: z.string().describe('Unique identifier for the calendar'),
  summary: z.string().describe('Title of the calendar'),
  description: z.string().optional().describe('Description of the calendar'),
  timeZone: z.string().optional().describe('Time zone of the calendar'),
  accessRole: z
    .enum(['freeBusyReader', 'reader', 'writer', 'owner'])
    .describe('Access role for the calendar'),
  primary: z
    .boolean()
    .optional()
    .describe('Whether this is the primary calendar'),
  selected: z
    .boolean()
    .optional()
    .describe('Whether this calendar is selected'),
  backgroundColor: z
    .string()
    .optional()
    .describe('Background color of the calendar'),
  foregroundColor: z
    .string()
    .optional()
    .describe('Foreground color of the calendar'),
});

export type GoogleCalendarList = z.infer<typeof GoogleCalendarListSchema>;

// Input/Output Types for Tools
export const GetGoogleCalendarEventsInputSchema = z.object({
  calendarId: z
    .string()
    .optional()
    .describe('Calendar ID to fetch events from. Defaults to primary calendar'),
  timeMin: z
    .string()
    .optional()
    .describe('Lower bound for event start times in RFC3339 format'),
  timeMax: z
    .string()
    .optional()
    .describe('Upper bound for event start times in RFC3339 format'),
  maxResults: z
    .number()
    .optional()
    .describe('Maximum number of events to return'),
  singleEvents: z
    .boolean()
    .optional()
    .describe('Whether to expand recurring events'),
  orderBy: z
    .enum(['startTime', 'updated'])
    .optional()
    .describe('Order of the events returned'),
  q: z.string().optional().describe('Free text search terms to find events'),
});

export const GetGoogleCalendarEventsOutputSchema = z.object({
  events: z
    .array(GoogleCalendarEventSchema)
    .describe('List of calendar events'),
  nextPageToken: z
    .string()
    .optional()
    .describe('Token for the next page of results'),
  summary: z.string().describe('Summary of the results'),
});

export const CreateGoogleCalendarEventInputSchema = z.object({
  calendarId: z
    .string()
    .optional()
    .describe('Calendar ID to create event in. Defaults to primary calendar'),
  summary: z.string().describe('Title of the event'),
  description: z.string().optional().describe('Description of the event'),
  start: z
    .object({
      dateTime: z.string().optional().describe('Start time in RFC3339 format'),
      date: z
        .string()
        .optional()
        .describe('Start date in YYYY-MM-DD format for all-day events'),
      timeZone: z.string().optional().describe('Time zone of the event'),
    })
    .describe('Start time of the event'),
  end: z
    .object({
      dateTime: z.string().optional().describe('End time in RFC3339 format'),
      date: z
        .string()
        .optional()
        .describe('End date in YYYY-MM-DD format for all-day events'),
      timeZone: z.string().optional().describe('Time zone of the event'),
    })
    .describe('End time of the event'),
  location: z.string().optional().describe('Location of the event'),
  attendees: z
    .array(z.string())
    .optional()
    .describe('List of attendee email addresses'),
  colorId: z.string().optional().describe('Color ID for the event'),
  visibility: z
    .enum(['default', 'public', 'private', 'confidential'])
    .optional()
    .describe('Visibility of the event'),
  recurrence: z
    .array(z.string())
    .optional()
    .describe('Recurrence rules for the event'),
});

export const CreateGoogleCalendarEventOutputSchema = z.object({
  event: GoogleCalendarEventSchema.describe('Created calendar event'),
  message: z.string().describe('Success message'),
});

export const UpdateGoogleCalendarEventInputSchema = z.object({
  calendarId: z
    .string()
    .optional()
    .describe('Calendar ID containing the event. Defaults to primary calendar'),
  eventId: z.string().describe('ID of the event to update'),
  updates: z
    .object({
      summary: z.string().optional().describe('Title of the event'),
      description: z.string().optional().describe('Description of the event'),
      start: z
        .object({
          dateTime: z
            .string()
            .optional()
            .describe('Start time in RFC3339 format'),
          date: z
            .string()
            .optional()
            .describe('Start date in YYYY-MM-DD format for all-day events'),
          timeZone: z.string().optional().describe('Time zone of the event'),
        })
        .optional()
        .describe('Start time of the event'),
      end: z
        .object({
          dateTime: z
            .string()
            .optional()
            .describe('End time in RFC3339 format'),
          date: z
            .string()
            .optional()
            .describe('End date in YYYY-MM-DD format for all-day events'),
          timeZone: z.string().optional().describe('Time zone of the event'),
        })
        .optional()
        .describe('End time of the event'),
      location: z.string().optional().describe('Location of the event'),
      attendees: z
        .array(z.string())
        .optional()
        .describe('List of attendee email addresses'),
      colorId: z.string().optional().describe('Color ID for the event'),
      visibility: z
        .enum(['default', 'public', 'private', 'confidential'])
        .optional()
        .describe('Visibility of the event'),
      status: z
        .enum(['confirmed', 'tentative', 'cancelled'])
        .optional()
        .describe('Status of the event'),
      recurrence: z
        .array(z.string())
        .optional()
        .describe('Recurrence rules for the event'),
    })
    .describe('Updates to apply to the event'),
});

export const UpdateGoogleCalendarEventOutputSchema = z.object({
  event: GoogleCalendarEventSchema.describe('Updated calendar event'),
  message: z.string().describe('Success message'),
});

export const DeleteGoogleCalendarEventInputSchema = z.object({
  calendarId: z
    .string()
    .optional()
    .describe('Calendar ID containing the event. Defaults to primary calendar'),
  eventId: z.string().describe('ID of the event to delete'),
  sendUpdates: z
    .enum(['all', 'externalOnly', 'none'])
    .optional()
    .describe('Whether to send notifications about the deletion'),
});

export const DeleteGoogleCalendarEventOutputSchema = z.object({
  message: z.string().describe('Success message'),
  deletedEventId: z.string().describe('ID of the deleted event'),
});

export const GetGoogleCalendarListInputSchema = z.object({
  minAccessRole: z
    .enum(['freeBusyReader', 'reader', 'writer', 'owner'])
    .optional()
    .describe('Minimum access role for calendars to return'),
});

export const GetGoogleCalendarListOutputSchema = z.object({
  calendars: z
    .array(GoogleCalendarListSchema)
    .describe('List of available calendars'),
  primaryCalendar: GoogleCalendarListSchema.optional().describe(
    'Primary calendar of the user',
  ),
  message: z.string().describe('Success message'),
});

// Type exports
export type GetGoogleCalendarEventsInput = z.infer<
  typeof GetGoogleCalendarEventsInputSchema
>;
export type GetGoogleCalendarEventsOutput = z.infer<
  typeof GetGoogleCalendarEventsOutputSchema
>;
export type CreateGoogleCalendarEventInput = z.infer<
  typeof CreateGoogleCalendarEventInputSchema
>;
export type CreateGoogleCalendarEventOutput = z.infer<
  typeof CreateGoogleCalendarEventOutputSchema
>;
export type UpdateGoogleCalendarEventInput = z.infer<
  typeof UpdateGoogleCalendarEventInputSchema
>;
export type UpdateGoogleCalendarEventOutput = z.infer<
  typeof UpdateGoogleCalendarEventOutputSchema
>;
export type DeleteGoogleCalendarEventInput = z.infer<
  typeof DeleteGoogleCalendarEventInputSchema
>;
export type DeleteGoogleCalendarEventOutput = z.infer<
  typeof DeleteGoogleCalendarEventOutputSchema
>;
export type GetGoogleCalendarListInput = z.infer<
  typeof GetGoogleCalendarListInputSchema
>;
export type GetGoogleCalendarListOutput = z.infer<
  typeof GetGoogleCalendarListOutputSchema
>;

// FreeBusy Types
export const FreeBusyCalendarSchema = z.object({
  id: z.string().describe('Calendar ID'),
  busy: z
    .array(
      z.object({
        start: z
          .string()
          .describe('Start time of busy period in RFC3339 format'),
        end: z.string().describe('End time of busy period in RFC3339 format'),
      }),
    )
    .describe('List of busy time periods'),
});

export const GetGoogleCalendarFreeBusyInputSchema = z.object({
  timeMin: z
    .string()
    .describe('Lower bound for the free/busy query in RFC3339 format'),
  timeMax: z
    .string()
    .describe('Upper bound for the free/busy query in RFC3339 format'),
  calendarIds: z
    .array(z.string())
    .optional()
    .describe(
      'List of calendar IDs to check. If not provided, checks primary calendar',
    ),
  groupExpansionMax: z
    .number()
    .optional()
    .describe(
      'Maximal number of calendar identifiers to be provided for a single group',
    ),
  timeZone: z.string().optional().describe('Time zone used in the response'),
});

export const GetGoogleCalendarFreeBusyOutputSchema = z.object({
  calendars: z
    .array(FreeBusyCalendarSchema)
    .describe('List of calendars with their busy periods'),
  groups: z
    .object({
      errors: z
        .array(
          z.object({
            domain: z.string().describe('Domain of the error'),
            reason: z.string().describe('Reason for the error'),
          }),
        )
        .optional()
        .describe('List of errors encountered'),
    })
    .optional()
    .describe('Expansion of groups'),
  timeMin: z.string().describe('Lower bound for the free/busy query'),
  timeMax: z.string().describe('Upper bound for the free/busy query'),
  summary: z.string().describe('Summary of the free/busy results'),
});

export type FreeBusyCalendar = z.infer<typeof FreeBusyCalendarSchema>;
export type GetGoogleCalendarFreeBusyInput = z.infer<
  typeof GetGoogleCalendarFreeBusyInputSchema
>;
export type GetGoogleCalendarFreeBusyOutput = z.infer<
  typeof GetGoogleCalendarFreeBusyOutputSchema
>;
