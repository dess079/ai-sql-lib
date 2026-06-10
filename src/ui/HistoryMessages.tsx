/**
 * Renders persisted conversation history when no live session is active.
 */
import type { JSX } from "react";
import type { Message } from "../types/conversation";
import { HistoryMessage } from "./HistoryMessage";

/** Props for {@link HistoryMessages}. */
export interface HistoryMessagesProps {
  messages: Message[];
}

/**
 * Renders a list of persisted history messages.
 *
 * @param props.messages - the list of messages to display
 * @returns the rendered history messages
 */
export function HistoryMessages({ messages }: HistoryMessagesProps): JSX.Element {
  let historyQuery = 0;

  const numberedHistoryMessages = messages
    .filter((m) => m.role !== "system")
    .map((msg) => {
      if (msg.role === "user") historyQuery += 1;

      return { msg, queryNumber: historyQuery || 1 };
    });

  return (
    <>
      {numberedHistoryMessages.map(({ msg, queryNumber }, index) => (
        <HistoryMessage
          key={msg.id}
          message={msg}
          queryNumber={queryNumber}
          showQueryHeading={
            index === 0 || numberedHistoryMessages[index - 1].queryNumber !== queryNumber
          }
        />
      ))}
    </>
  );
}
