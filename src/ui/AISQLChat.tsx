/**
 * Drop-in AI-SQL chat experience. Composes hooks + UI components into a single
 * widget that consumers embed with a single tag.
 *
 * @example
 * ```tsx
 * <AISQLChat backendUrl="http://localhost:4000" userId="default" />
 * ```
 */
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { Box, Drawer, Snackbar } from "@mui/material";
import type { TokenUsage } from "../types/models";
import { useModels } from "../hooks/useModels";
import { useSubmitQuery } from "../hooks/useSubmitQuery";
import { useSSEStream } from "../hooks/useSSEStream";
import { useAISQL } from "../hooks/useAISQL";
import { useConversation } from "../hooks/useConversation";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { useSessionHistory } from "../hooks/useSessionHistory";
import { ConversationList } from "./ConversationList";
import { PromptInput } from "./PromptInput";
import { AISQLChatBody } from "./AISQLChatBody";
import { AISQLToolbar } from "./AISQLToolbar";
import { SessionDetailDialog } from "./SessionDetailDialog";

/** Props for {@link AISQLChat}. */
export interface AISQLChatProps {
  backendUrl: string;
  userId?: string;
  /** Initial drawer width in px. */
  sidebarWidth?: number;
}

/**
 * Main AI-SQL chat widget. Composes sidebar, toolbar, body and prompt.
 * @param props.backendUrl - absolute backend URL (no trailing slash)
 * @param props.userId - user id (default "default")
 * @param props.sidebarWidth - drawer width in px (default 280)
 * @returns the chat UI
 */
export function AISQLChat({ backendUrl, userId = "default", sidebarWidth = 280 }: AISQLChatProps): JSX.Element {
  const { providers } = useModels(backendUrl);
  const [model, setModel] = useState<string | null>(null);
  useEffect(() => {
    if (!model && providers.length > 0) {
      const all = providers.filter((p) => p.enabled).flatMap((p) => p.models);
      setModel((all.find((m) => m.recommended) ?? all[0])?.id ?? null);
    }
  }, [providers, model]);

  const [sessionId, setSessionId] = useSessionStorage();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [resumed, setResumed] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const { state, apply, reset, clear } = useAISQL(sessionId);
  const { submit, submitting } = useSubmitQuery(backendUrl);
  const { conversations, loading, reload, remove, rename, loadMessages } = useConversation(backendUrl, userId);
  const { historyMessages, loadHistory, clearHistory, detailOpen, detailTitle, detailMsgs, detailLoading, openDetail, closeDetail } = useSessionHistory(loadMessages);

  const allModels = providers.filter((p) => p.enabled).flatMap((p) => p.models);
  const historyTokens = historyMessages.reduce((sum, m) => sum + Math.ceil(m.content.length / 4), 0);
  const effectiveUsage: TokenUsage | null = model
    ? { model, used: state.tokenUsage?.model === model ? state.tokenUsage.used : historyTokens, max: allModels.find((m) => m.id === model)?.contextWindow ?? 0 }
    : null;

  useSSEStream({ backendUrl, sessionId, onEvent: apply, onClose: (r) => { setStreaming(false); if (r === "complete") reload(); } });
  useEffect(() => { if (sessionId && state.steps.length === 0) setResumed(true); }, [sessionId, state.steps.length]);

  const onSubmit = async (prompt: string): Promise<void> => {
    reset(prompt); setStreaming(true); clearHistory();
    try {
      const res = await submit(prompt, { model: model ?? undefined, conversationId: conversationId ?? undefined, userId });
      setSessionId(res.sessionId); setConversationId(res.conversationId);
    } catch { setStreaming(false); }
  };

  const activeTitle = conversations.find((c) => c.id === conversationId)?.title ?? "";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AISQLToolbar providers={providers} model={model} onModelChange={setModel} tokenUsage={effectiveUsage}
        submitting={submitting} streaming={streaming} sessionTitle={activeTitle} onSubmit={onSubmit} />

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Drawer variant="permanent" sx={{ width: sidebarWidth, "& .MuiDrawer-paper": { width: sidebarWidth, position: "relative" } }}>
          <ConversationList conversations={conversations} loading={loading} activeId={conversationId}
            onSelect={(id) => { clear(); setConversationId(id); setSessionId(null); void loadHistory(id); }}
            onDelete={remove} onRename={rename}
            onNewSession={() => { setConversationId(null); setSessionId(null); setStreaming(false); clear(); clearHistory(); }}
            onDetail={(id) => void openDetail(id, conversations.find((c) => c.id === id)?.title ?? "")} />
        </Drawer>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "clip" }}>
          <AISQLChatBody state={state} backendUrl={backendUrl} historyMessages={historyMessages} />
          <PromptInput onSubmit={onSubmit} disabled={submitting || streaming} tokenUsage={effectiveUsage} busy={submitting || streaming} />
        </Box>
      </Box>

      <SessionDetailDialog open={detailOpen} onClose={closeDetail}
        title={detailTitle} messages={detailMsgs} loading={detailLoading} />
      <Snackbar open={resumed} autoHideDuration={3000} onClose={() => setResumed(false)} message="Session restored from URL" />
    </Box>
  );
}

