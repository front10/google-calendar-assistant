/**
 * Configuration for Google Calendar Assistant security and features
 */

export const GOOGLE_CALENDAR_CONFIG = {
  // Rate limiting configuration
  rateLimits: {
    getCalendarList: { maxRequests: 50, windowMs: 60000 }, // 50 requests per minute
    getEvents: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
    createEvent: { maxRequests: 20, windowMs: 60000 }, // 20 requests per minute
    updateEvent: { maxRequests: 30, windowMs: 60000 }, // 30 requests per minute
    deleteEvent: { maxRequests: 10, windowMs: 60000 }, // 10 requests per minute
  },

  // Security settings
  security: {
    maxEventTitleLength: 200,
    maxEventDescriptionLength: 2000,
    maxLocationLength: 200,
    maxAttendeesPerEvent: 100,
    allowedTimeZones: [
      'UTC',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Australia/Sydney',
    ],
  },

  // Calendar settings
  calendar: {
    defaultTimeZone: 'UTC',
    maxEventsPerRequest: 100,
    defaultEventDuration: 60, // minutes
    supportedRecurrenceTypes: ['daily', 'weekly', 'monthly', 'yearly'],
    supportedEventStatuses: ['confirmed', 'tentative', 'cancelled'],
    supportedVisibilityLevels: ['default', 'public', 'private', 'confidential'],
  },

  // UI settings
  ui: {
    eventsPerPage: 20,
    maxCalendarDaysToShow: 42, // 6 weeks
    defaultCalendarView: 'month',
    showEventDetailsInList: true,
    enableEventSearch: true,
    enableEventFiltering: true,
  },

  // Error messages
  errors: {
    authentication: {
      noToken: 'Authentication required. Please sign in with Google.',
      invalidToken: 'Invalid or expired authentication token.',
      insufficientPermissions: 'Insufficient permissions to access calendar.',
    },
    rateLimit: {
      exceeded: 'Too many requests. Please wait a moment before trying again.',
    },
    validation: {
      invalidEventData: 'Invalid event data provided.',
      invalidDateRange: 'Invalid date range specified.',
      invalidCalendarId: 'Invalid calendar ID specified.',
    },
    network: {
      connectionError:
        'Unable to connect to Google Calendar. Please check your internet connection.',
      timeoutError: 'Request timed out. Please try again.',
    },
  },
} as const;

export type GoogleCalendarConfig = typeof GOOGLE_CALENDAR_CONFIG;
