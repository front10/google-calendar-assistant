'use client';

import type { ChatMessage } from '@/lib/types';
import { generateUUID } from '@/lib/utils';

export interface UserAction {
  toolId: string;
  toolCallId?: string;
  action: string;
  data?: any;
  context?: any;
}

export function useGenerativeActions({
  sendMessage,
}: {
  sendMessage: (message: ChatMessage) => void;
}) {
  const handleUserAction = (action: UserAction) => {
    // Create descriptive messages based on actions
    let content = '';

    switch (action.action) {
      case 'add_to_cart':
        content = `I want to add ${action.data?.productName || 'this product'} to my cart`;
        break;
      case 'view_details':
        content = `Show me more details about ${action.data?.productName || 'this product'}`;
        break;
      case 'add_to_wishlist':
        content = `I want to add ${action.data?.productName || 'this product'} to my wishlist`;
        break;
      case 'share_product':
        content = `I want to share ${action.data?.productName || 'this product'}`;
        break;
      case 'create_event':
        content = `I want to create a new event`;
        break;
      case 'edit_event':
        content = `I want to edit the event: ${action.data?.eventTitle || 'this event'}`;
        break;
      case 'delete_event':
        content = `I want to delete the event: ${action.data?.eventTitle || 'this event'}`;
        break;
      case 'confirm_event':
        content = `I want to confirm the event: ${action.data?.eventTitle || 'this event'}`;
        break;
      case 'cancel_event':
        content = `I want to cancel the event: ${action.data?.eventTitle || 'this event'}`;
        break;
      case 'view_event_details':
        content = `Show me details for the event: ${action.data?.eventTitle || 'this event'}`;
        break;
      case 'share_event':
        content = `I want to share the event: ${action.data?.eventTitle || 'this event'}`;
        break;
      case 'retry_load':
        content = `Please retry loading the data`;
        break;
      case 'report_error':
        content = `I want to report an error: ${action.data?.error || 'unknown error'}`;
        break;
      case 'retry_load_events':
        content = `Please retry loading the calendar events`;
        break;
      case 'refresh_calendar':
        content = `Please refresh the calendar`;
        break;
      case 'select_calendar':
        content = `I want to work with the calendar: ${action.data?.calendarName || 'selected calendar'} (ID: ${action.data?.calendarId})`;
        break;
      case 'view_calendar_events':
        content = `Show me events from the calendar: ${action.data?.calendarName || 'selected calendar'}`;
        break;
      case 'refresh_calendar_list':
        content = `Please refresh the calendar list`;
        break;
      case 'manage_calendar':
        content = `I want to manage the calendar: ${action.data?.calendarName || 'selected calendar'}`;
        break;
      case 'get_events_for_view': {
        const viewMode = action.data?.viewMode || 'calendar';
        const timeMin = action.data?.timeMin
          ? new Date(action.data.timeMin).toLocaleDateString()
          : 'start date';
        const timeMax = action.data?.timeMax
          ? new Date(action.data.timeMax).toLocaleDateString()
          : 'end date';
        content = `Show me calendar events in ${viewMode} view from ${timeMin} to ${timeMax}`;
        break;
      }
      case 'refresh_freebusy':
        content = `Please refresh the free/busy availability information`;
        break;
      case 'create_event_from_freebusy': {
        const startTime = action.data?.start
          ? new Date(action.data.start).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'selected time';
        const endTime = action.data?.end
          ? new Date(action.data.end).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'end time';
        content = `I want to create a new event from ${startTime} to ${endTime} using the free/busy information`;
        break;
      }
      case 'retry_freebusy':
        content = `Please retry loading the free/busy availability information`;
        break;
      default:
        content = `I performed the action: ${action.action}`;
    }

    // Send to LLM using sendMessage (Vercel AI SDK v5)
    // console.log('action', action);
    sendMessage({
      role: 'user',
      id: generateUUID(),
      parts: [
        {
          type: 'text',
          text: content,
        },
      ],
    });
  };

  return { handleUserAction };
}
