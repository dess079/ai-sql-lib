/** Drop-in AI-SQL chat experience — UI déléguée à shared-components (AiChatPanel + AiConversationSidebar). */
import type { JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Snackbar } from "@mui/material";
import { AiChatPanel, AiConversationSidebar, AiSessionDetailDialog, type AiChatTurn, type AiChatMessage, type AiConversationRow } from "shared-components";
import type { TokenUsage } from "../types/models";
import { useModels } from "../hooks/useModels";
import { useSubmitQuery } from "../hooks/useSubmitQuery";
import { useConversationSelection } from "../hooks/useConversationSelection";
import { useAISQLChatSession } from "../hooks/useAISQLChatSession";
import { useSSEStream } from "../hooks/useSSEStream";
import { useAISQL } from "../hooks/useAISQL";
import { buildModelReference, parseModelReference } from "../utils/modelRef";
import { useConversation } from "../hooks/useConversation";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { useSessionHistory } from "../hooks/useSessionHistory";
import { useNewSessionDraft } from "../hooks/useNewSessionDraft";
import { useLastConversationSelection } from "../hooks/useLastConversationSelection";
import { useConversationOutcome } from "../hooks/useConversationOutcome";
import { AISQLToolbar } from "./AISQLToolbar";
import { toAiChatMessage } from "./aiMapping";

/** Props for {@link AISQLChat}. */
export interface AISQLChatProps {
  backendUrl: string;
  userId?: string;
  sidebarWidth?: number;
  authToken?: string;
  /** External model reference (`provider|model`) overriding the auto-detected one. */
  initialModelRef?: string | null;
  /**
   * Optional replacement for the built-in model selector (e.g. shared-components'
   * LlmModelSelector). Receives the current `provider|model` ref and change callback.
   */
  modelSelector?: (props: { value: string | null; onChange: (ref: string | null) => void; disabled?: boolean }) => JSX.Element;
}

/** Main AI-SQL chat widget — orchestration only, rendering lives in shared-components. */
export function AISQLChat({ backendUrl, userId = "default", sidebarWidth = 280, authToken, initialModelRef, modelSelector }: AISQLChatProps): JSX.Element {
  const { providers } = useModels(backendUrl, authToken);
  const [model, setModel] = useState<string | null>(null);
  useEffect(() => {
    if (initialModelRef) {
      setModel(initialModelRef);
      return;
    }
    if (!model && providers.length > 0) {
      const enabled = providers.filter((p) => p.enabled);
      const preferred = enabled.flatMap((p) => p.models.filter((m) => m.recommended).map((m) => buildModelReference(p.key, m.id)));
      const all = enabled.flatMap((p) => p.models.map((m) => buildModelReference(p.key, m.id)));
      setModel(preferred[0] ?? all[0] ?? null);
    }
  }, [providers, model, initialModelRef]);
  const [sessionId, setSessionId] = useSessionStorage();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const { state, apply, reset, clear } = useAISQL(sessionId);
  const { saveSuccess, saveError, readOutcome } = useConversationOutcome();
  const selectedModelRef = parseModelReference(model);
  const selectedProvider = providers.find((p) => p.key === selectedModelRef.provider);
  const { submit, submitting } = useSubmitQuery(backendUrl, authToken);
  const { conversations, loading, reload, remove, removeMany, copy, rename, loadMessages } = useConversation(backendUrl, userId, authToken);
  const { historyMessages, loadHistory, clearHistory, detailOpen, detailTitle, detailMsgs, detailLoading, openDetail, closeDetail } = useSessionHistory(loadMessages, readOutcome);
  const { listConversations, draftConversationId, startNewSession, onSubmitResolved } = useNewSessionDraft(conversations, userId);
  useLastConversationSelection({ userId, conversationId, conversations, setConversationId, setSessionId, clear, loadHistory, skip: !!draftConversationId });
  const { activeSidebarId, activeTitle, onSubmit, onSelectConversation, onNewSession } = useAISQLChatSession({ conversations: listConversations, conversationId, draftConversationId, selectedProviderLabel: selectedProvider?.label ?? selectedProvider?.key, model, userId, submit, setConversationId, setSessionId, setStreaming, reset, clear, clearHistory, apply, onSubmitResolved, startNewSession, loadHistory });
  const { selectedIds, toggleSelectAll, deleteSelected, deleteOne, copySession } = useConversationSelection({
    conversationId,
    conversations,
    clear,
    clearHistory,
    remove,
    removeMany,
    copy,
    setConversationId,
  });

  const streamingRef = useRef(false);
  streamingRef.current = streaming;
  useSSEStream({
    backendUrl, sessionId, authToken, onEvent: apply,
    onClose: (r) => {
      const was = streamingRef.current;
      setStreaming(false);
      if (r === "complete") {
        if (conversationId) saveSuccess(conversationId);
        reload();
      } else if (r === "error" && was) {
        const message = "La connexion au serveur a été perdue. Veuillez réessayer.";
        if (conversationId) saveError(conversationId, message);
        apply({ event: "error", data: { error: message, code: "STREAM_ERROR" } });
      }
    },
  });
  useEffect(() => { if (state.error && conversationId) saveError(conversationId, state.error); }, [conversationId, saveError, state.error]);

  /** Mapping live state + completed turns → shared AiChatTurn[]. */
  const turns: AiChatTurn[] = useMemo(() => {
    const archived: AiChatTurn[] = state.completedTurns.map((t, i) => ({
      id: `turn-${i}`,
      userPrompt: t.userPrompt,
      model: t.model,
      provider: t.provider,
      response: { rephrased: t.rephrased, code: t.sql, codeLanguage: "sql", result: t.result, narrative: t.narrative, steps: [], finished: true },
    }));
    const live: AiChatTurn[] = state.currentPrompt ? [{
      id: "live",
      userPrompt: state.currentPrompt,
      model: state.model ?? model ?? undefined,
      provider: selectedProvider?.label ?? selectedProvider?.key,
      response: {
        rephrased: state.rephrased,
        code: state.sql,
        codeLanguage: "sql",
        codeIssues: state.validationIssues,
        result: state.result,
        narrative: state.narrative || undefined,
        steps: state.steps,
        finished: state.finished,
        error: state.error,
        retryAttempt: state.retryAttempt,
        retryMax: state.retryMax,
      },
    }] : [];
    return [...archived, ...live];
  }, [state, model, selectedProvider]);

  const history: AiChatMessage[] = useMemo(
    () => historyMessages.map(toAiChatMessage),
    [historyMessages],
  );

  const sidebarRows: AiConversationRow[] = useMemo(
    () => listConversations.map((c) => ({ id: c.id, backendId: c.backendId, title: c.title, model: c.model, updatedAt: c.updatedAt, isNew: c.isNew })),
    [listConversations],
  );

  const modelSlot = useMemo(() => (
    modelSelector ? modelSelector({ value: model, onChange: setModel }) : null
  ), [modelSelector, model]);

  const allModels = providers.filter((p) => p.enabled).flatMap((p) => p.models);
  const historyTokens = historyMessages.reduce((sum, m) => sum + Math.ceil(m.content.length / 4), 0);
  const activeTokenModel = parseModelReference(state.tokenUsage?.model).model;
  const effectiveUsage: TokenUsage | null = model
    ? { model, used: activeTokenModel === model ? state.tokenUsage?.used ?? historyTokens : historyTokens, max: allModels.find((m) => m.id === model)?.contextWindow ?? 0 }
    : null;

  return (
    <Box sx={{ display: "flex", height: "100%", overflow: "hidden", bgcolor: "background.default", color: "text.primary" }}>
      <AiConversationSidebar
        sidebarWidth={sidebarWidth}
        conversations={sidebarRows}
        loading={loading}
        activeId={activeSidebarId}
        selectedIds={selectedIds}
        onSelect={onSelectConversation}
        onToggleSelectAll={toggleSelectAll}
        onDeleteSelected={() => void deleteSelected()}
        onDelete={(id) => void deleteOne(id)}
        onCopy={(id) => void copySession(id)}
        onRename={(id, title) => rename(id, title)}
        onNewSession={onNewSession}
        onDetail={(id) => void openDetail(id, sidebarRows.find((c) => c.backendId === id)?.title ?? "")}
      />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AiChatPanel
          turns={turns}
          historyMessages={history}
          busy={submitting || streaming}
          onPromptSubmit={onSubmit}
          resetKey={conversationId ?? "new"}
          toolbar={<AISQLToolbar backendUrl={backendUrl} tokenUsage={effectiveUsage} submitting={submitting} streaming={streaming} sessionTitle={activeTitle} onSubmit={onSubmit} authToken={authToken} />}
          modelSlot={modelSlot}
          welcomeTitle="Que souhaitez-vous savoir ?"
          welcomeSubtitle="Posez une question sur vos données — SQL généré, exécuté et expliqué."
        />
      </Box>

      <AiSessionDetailDialog open={detailOpen} onClose={closeDetail} title={detailTitle}
        messages={detailMsgs.map(toAiChatMessage)} loading={detailLoading} />
      <Snackbar open={false} message="" />
    </Box>
  );
}