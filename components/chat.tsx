'use client';

import { DefaultChatTransport } from 'ai';
import { useChat } from '@ai-sdk/react';
import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher, fetchWithErrorHandlers, generateUUID } from '@/lib/utils';
import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import type { VisibilityType } from './visibility-selector';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { unstable_serialize } from 'swr/infinite';
import { getChatHistoryPaginationKey } from './sidebar-history';
import { toast } from './toast';
import type { Session } from 'next-auth';
import { useSearchParams } from 'next/navigation';
import { useChatVisibility } from '@/hooks/use-chat-visibility';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { ChatSDKError } from '@/lib/errors';
import type { Attachment, ChatMessage } from '@/lib/types';
import { useDataStream } from './data-stream-provider';
import { useGenerativeUI } from '@/package/front10-generative-ui/src';
import { useGenerativeActions } from '@/hooks/use-generative-actions';
import {
  GoogleCalendarComponent,
  GoogleCalendarLoading,
  GoogleCalendarError,
  CalendarListComponent,
  CalendarListLoading,
  CalendarListError,
  useActiveCalendar,
} from '@/components/google-calendar';
import {
  FreeBusyComponent,
  FreeBusyLoading,
  FreeBusyError,
} from './google-calendar/freebusy-component';
import { GoogleStatusIndicator } from '@/components/google-status-indicator';
import { useGoogleAuth } from '@/hooks/use-google-auth';

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  session,
  autoResume,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  session: Session;
  autoResume: boolean;
}) {
  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  });

  const { mutate } = useSWRConfig();
  const { setDataStream } = useDataStream();

  const [input, setInput] = useState<string>('');
  const [messageQueue, setMessageQueue] = useState<ChatMessage[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [queuedMessageContent, setQueuedMessageContent] = useState<string>('');

  // Hook para manejar el calendario activo
  const { activeCalendar, setActiveCalendarData, clearActiveCalendar } =
    useActiveCalendar();

  // Hook para obtener tokens de Google
  const { accessToken, refreshToken } = useGoogleAuth();

  // Registrar componentes usando useEffect
  const { registerComponent } = useGenerativeUI();

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
  } = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    experimental_throttle: 100,
    generateId: generateUUID,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      fetch: fetchWithErrorHandlers,
      prepareSendMessagesRequest({ messages, id, body }) {
        // Leer directamente del localStorage como fallback
        let directAccessToken = null;
        let directRefreshToken = null;

        if (typeof window !== 'undefined') {
          try {
            const rawData = localStorage.getItem('google_auth_data');
            if (rawData) {
              const parsed = JSON.parse(rawData);
              directAccessToken = parsed.accessToken;
              directRefreshToken = parsed.refreshToken;
            }
          } catch (e) {
            console.error('Error reading localStorage directly:', e);
          }
        }

        const googleTokens = {
          accessToken: accessToken || directAccessToken || undefined,
          refreshToken: refreshToken || directRefreshToken || undefined,
        };

        return {
          body: {
            id,
            message: messages.at(-1),
            selectedChatModel: initialChatModel,
            selectedVisibilityType: visibilityType,
            googleTokens,
            ...body,
          },
        };
      },
    }),
    onData: (dataPart) => {
      //@ts-ignore
      setDataStream((ds) => (ds ? [...ds, dataPart] : []));
    },
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast({
          type: 'error',
          description: error.message,
        });
      }
    },
  });

  // Queue management functions
  const processMessageQueue = useCallback(async () => {
    if (
      isProcessingQueue ||
      messageQueue.length === 0 ||
      status === 'streaming'
    ) {
      return;
    }

    setIsProcessingQueue(true);
    const nextMessage = messageQueue[0];

    try {
      // Clear the queued message indicator when sending
      setQueuedMessageContent('');
      await sendMessage(nextMessage);
      setMessageQueue((prev) => prev.slice(1));
    } catch (error) {
      console.error('Error processing message queue:', error);
    } finally {
      setIsProcessingQueue(false);
    }
  }, [isProcessingQueue, messageQueue, status, sendMessage]);

  // Process queue when status changes to ready
  useEffect(() => {
    if (status === 'ready' && messageQueue.length > 0) {
      processMessageQueue();
    }
  }, [status, messageQueue.length, processMessageQueue]);

  // Enhanced sendMessage that handles queueing
  const queuedSendMessage = useCallback(
    (message: ChatMessage) => {
      if (status === 'streaming' || isProcessingQueue) {
        // Add to queue instead of sending immediately
        setMessageQueue((prev) => [...prev, message]);

        // Extract text content from message parts for display
        const textContent = message.parts
          .filter((part) => part.type === 'text')
          .map((part) => part.text)
          .join(' ');

        setQueuedMessageContent(textContent);
        return Promise.resolve();
      } else {
        // Send immediately if ready
        return sendMessage(message);
      }
    },
    [status, isProcessingQueue, sendMessage],
  );

  const { handleUserAction } = useGenerativeActions({
    sendMessage: queuedSendMessage,
  });

  // Manejar acciones específicas de Google Calendar
  const handleCalendarAction = useCallback(
    (action: {
      action: string;
      data?: any;
      context?: any;
    }) => {
      if (action.action === 'select_calendar') {
        setActiveCalendarData({
          id: action.data?.calendarId,
          name: action.data?.calendarName,
          isPrimary: action.data?.isPrimary,
        });
      } else if (action.action === 'clear_calendar') {
        clearActiveCalendar();
      }

      // Determinar el toolId apropiado basado en la acción
      let toolId = 'getGoogleCalendarList'; // Default para acciones de lista de calendarios

      // Acciones relacionadas con eventos de calendario
      if (
        [
          'get_events_for_view',
          'create_event',
          'edit_event',
          'delete_event',
          'view_event_details',
          'share_event',
          'refresh_events',
          'retry_load_events',
        ].includes(action.action)
      ) {
        toolId = 'getGoogleCalendarEvents';
      }

      // Pasar la acción al handler principal con toolId requerido
      handleUserAction({
        toolId: toolId,
        action: action.action,
        data: action.data,
        context: action.context,
      });
    },
    [setActiveCalendarData, clearActiveCalendar, handleUserAction],
  );

  // Registrar componentes de Google Calendar
  useLayoutEffect(() => {
    // Registrar el componente de Lista de Calendarios
    registerComponent({
      toolId: 'getGoogleCalendarList',
      LoadingComponent: CalendarListLoading,
      SuccessComponent: CalendarListComponent,
      ErrorComponent: CalendarListError,
      onUserAction: (action) => {
        handleCalendarAction(action);
      },
    });

    // Registrar el componente de Eventos de Calendario
    registerComponent({
      toolId: 'getGoogleCalendarEvents',
      LoadingComponent: GoogleCalendarLoading,
      SuccessComponent: GoogleCalendarComponent,
      ErrorComponent: GoogleCalendarError,
      onUserAction: (action) => {
        handleCalendarAction(action);
      },
    });

    // Registrar el componente de Free/Busy
    registerComponent({
      toolId: 'getGoogleCalendarFreeBusy',
      LoadingComponent: FreeBusyLoading,
      SuccessComponent: FreeBusyComponent,
      ErrorComponent: FreeBusyError,
      onUserAction: (action) => {
        handleCalendarAction(action);
      },
    });
  }, [registerComponent, handleUserAction, handleCalendarAction]);

  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage({
        role: 'user' as const,
        parts: [{ type: 'text', text: query }],
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, '', `/chat/${id}`);
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  useAutoResume({
    autoResume,
    initialMessages,
    resumeStream,
    setMessages,
  });

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          chatId={id}
          selectedModelId={initialChatModel}
          selectedVisibilityType={initialVisibilityType}
          isReadonly={isReadonly}
          session={session}
        />

        {/* Indicador de Estado de Google Calendar */}
        <GoogleStatusIndicator />

        {/* Queue Status Indicator */}
        {messageQueue.length > 0 && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <div className="animate-spin rounded-full size-4 border-2 border-blue-600 border-t-transparent" />
                <span>
                  {messageQueue.length === 1
                    ? '1 message queued'
                    : `${messageQueue.length} messages queued`}{' '}
                  - waiting for AI to finish
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Indicador de Calendario Activo */}
        {/* <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="max-w-3xl mx-auto">
            <ActiveCalendarIndicator
              calendarName={activeCalendar.name}
              calendarId={activeCalendar.id}
              isPrimary={activeCalendar.isPrimary}
              onCalendarChange={() => {
                // Enviar mensaje para mostrar calendarios disponibles
                sendMessage({
                  role: 'user',
                  parts: [
                    { type: 'text', text: 'Show me my available calendars' },
                  ],
                });
              }}
            />
          </div>
        </div> */}

        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          regenerate={regenerate}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
          queuedMessageContent={queuedMessageContent}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              sendMessage={sendMessage}
              selectedVisibilityType={visibilityType}
            />
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        sendMessage={sendMessage}
        messages={messages}
        setMessages={setMessages}
        regenerate={regenerate}
        votes={votes}
        isReadonly={isReadonly}
        selectedVisibilityType={visibilityType}
      />
    </>
  );
}
