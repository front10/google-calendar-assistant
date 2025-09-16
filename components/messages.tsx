import { PreviewMessage, ThinkingMessage } from './message';
import { GoogleCalendarWelcomeMessage } from '@/components/google-calendar';
import { memo, useEffect } from 'react';
import type { Vote } from '@/lib/db/schema';
import equal from 'fast-deep-equal';
import type { UseChatHelpers } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import { useMessages } from '@/hooks/use-messages';
import type { ChatMessage } from '@/lib/types';
import { useDataStream } from './data-stream-provider';

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers<ChatMessage>['status'];
  votes: Array<Vote> | undefined;
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>['setMessages'];
  regenerate: UseChatHelpers<ChatMessage>['regenerate'];
  isReadonly: boolean;
  isArtifactVisible: boolean;
  onUserAction?: (action: any) => void;
  queuedMessageContent?: string;
}

function PureMessages({
  chatId,
  status,
  votes,
  messages,
  setMessages,
  regenerate,
  isReadonly,
  onUserAction,
  queuedMessageContent,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  } = useMessages({
    chatId,
    status,
  });

  useDataStream();

  // Auto-scroll when queued message appears
  useEffect(() => {
    // console.log('status', status);
    if (queuedMessageContent && messagesEndRef.current) {
      // Small delay to ensure the message is rendered
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }, 100);
    }
  }, [queuedMessageContent, messagesEndRef, status]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative"
    >
      {messages.length === 0 && <GoogleCalendarWelcomeMessage />}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={status === 'streaming' && messages.length - 1 === index}
          vote={
            votes
              ? votes.find((vote) => vote.messageId === message.id)
              : undefined
          }
          setMessages={setMessages}
          regenerate={regenerate}
          isReadonly={isReadonly}
          requiresScrollPadding={
            hasSentMessage && index === messages.length - 1
          }
        />
      ))}

      {/* Queued Message - appears as part of conversation */}
      {queuedMessageContent && (
        <motion.div
          data-testid="queued-message"
          className="w-full mx-auto max-w-3xl px-4 group/message"
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          data-role="user"
        >
          <div className="flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:w-fit">
            <div className="bg-muted text-muted-foreground px-3 py-2 rounded-xl border-2 border-dashed border-muted-foreground/30 opacity-75">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full size-3 border border-muted-foreground border-t-transparent" />
                <span className="text-sm">{queuedMessageContent}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Queued - waiting for AI to finish
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {status === 'submitted' &&
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

      <motion.div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
        onViewportLeave={onViewportLeave}
        onViewportEnter={onViewportEnter}
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isArtifactVisible && nextProps.isArtifactVisible) return true;

  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;
  if (prevProps.queuedMessageContent !== nextProps.queuedMessageContent)
    return false;

  // return true;
  return false;
});
