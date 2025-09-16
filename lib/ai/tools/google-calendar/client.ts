import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GoogleCalendarClient {
  private auth: OAuth2Client;
  private calendar: any;

  constructor(googleTokens: { accessToken: string; refreshToken?: string }) {
    if (!googleTokens.accessToken) {
      throw new Error(
        'No access token available. User must be authenticated with Google.',
      );
    }

    this.auth = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID || '',
      process.env.GOOGLE_CLIENT_SECRET || '',
    );

    this.auth.setCredentials({
      access_token: googleTokens.accessToken,
      refresh_token: googleTokens.refreshToken,
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  /**
   * Get list of available calendars
   */
  async getCalendarList() {
    try {
      const response = await this.calendar.calendarList.list({
        minAccessRole: 'reader',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar list:', error);
      throw new Error('Failed to fetch calendar list');
    }
  }

  /**
   * Get events from a specific calendar
   */
  async getEvents(params: {
    calendarId?: string;
    timeMin?: string;
    timeMax?: string;
    maxResults?: number;
    singleEvents?: boolean;
    orderBy?: 'startTime' | 'updated';
    q?: string;
  }) {
    try {
      const response = await this.calendar.events.list({
        calendarId: params.calendarId || 'primary',
        timeMin: params.timeMin,
        timeMax: params.timeMax,
        maxResults: params.maxResults || 100,
        singleEvents: params.singleEvents !== false,
        orderBy: params.orderBy || 'startTime',
        q: params.q,
      });

      return {
        events: response.data.items || [],
        nextPageToken: response.data.nextPageToken,
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  /**
   * Create a new event
   */
  async createEvent(calendarId: string, eventData: any) {
    try {
      const response = await this.calendar.events.insert({
        calendarId: calendarId || 'primary',
        resource: eventData,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(calendarId: string, eventId: string, eventData: any) {
    try {
      const response = await this.calendar.events.patch({
        calendarId: calendarId || 'primary',
        eventId,
        resource: eventData,
      });

      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(calendarId: string, eventId: string, sendUpdates?: string) {
    try {
      await this.calendar.events.delete({
        calendarId: calendarId || 'primary',
        eventId,
        sendUpdates: sendUpdates || 'none',
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  /**
   * Get a specific event
   */
  async getEvent(calendarId: string, eventId: string) {
    try {
      const response = await this.calendar.events.get({
        calendarId: calendarId || 'primary',
        eventId,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error('Failed to fetch event');
    }
  }

  /**
   * Get free/busy information for calendars
   */
  async getFreeBusy(params: {
    timeMin: string;
    timeMax: string;
    calendarIds?: string[];
    groupExpansionMax?: number;
    timeZone?: string;
  }) {
    try {
      const requestBody: any = {
        timeMin: params.timeMin,
        timeMax: params.timeMax,
      };

      if (params.calendarIds && params.calendarIds.length > 0) {
        requestBody.items = params.calendarIds.map((id) => ({ id }));
      } else {
        requestBody.items = [{ id: 'primary' }];
      }

      if (params.groupExpansionMax) {
        requestBody.groupExpansionMax = params.groupExpansionMax;
      }

      if (params.timeZone) {
        requestBody.timeZone = params.timeZone;
      }

      const response = await this.calendar.freebusy.query({
        resource: requestBody,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching free/busy information:', error);
      throw new Error('Failed to fetch free/busy information');
    }
  }

  /**
   * Check if the access token is valid and refresh if necessary
   */
  async refreshTokenIfNeeded() {
    try {
      await this.auth.getAccessToken();
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh access token');
    }
  }
}

/**
 * Create a Google Calendar client using provided tokens
 */
export function createGoogleCalendarClient(googleTokens: {
  accessToken: string;
  refreshToken?: string;
}): GoogleCalendarClient {
  return new GoogleCalendarClient(googleTokens);
}
