# Graph Report - ai-sql-lib  (2026-09-20)

## Corpus Check
- 62 files · ~18,133 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 335 nodes · 696 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `94c0465b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- ui/index.ts
- package.json
- AISQLChatBody.tsx
- AISQLChat.tsx
- events.ts
- ResultsDisplay.tsx
- conversation.ts
- compilerOptions
- useNewSessionDraft.ts
- schema.ts
- @sd/ai-sql
- rollup.config.js

## God Nodes (most connected - your core abstractions)
1. `Message` - 16 edges
2. `AISQLChat()` - 16 edges
3. `compilerOptions` - 16 edges
4. `QueryResult` - 15 edges
5. `TokenUsage` - 14 edges
6. `Conversation` - 13 edges
7. `parseModelReference()` - 13 edges
8. `ChartView()` - 9 edges
9. `ConversationOutcome` - 7 edges
10. `AISQLEvent` - 7 edges

## Surprising Connections (you probably didn't know these)
- `ResultsDisplayProps` --references--> `QueryResult`  [EXTRACTED]
  src/ui/ResultsDisplay.tsx → src/types/schema.ts
- `ResultsTableProps` --references--> `QueryResult`  [EXTRACTED]
  src/ui/ResultsTable.tsx → src/types/schema.ts
- `CompletedTurn` --references--> `QueryResult`  [EXTRACTED]
  src/hooks/useAISQL.ts → src/types/schema.ts
- `AISQLChatBodyProps` --references--> `AISQLState`  [EXTRACTED]
  src/ui/AISQLChatBody.tsx → src/hooks/useAISQL.ts
- `UseConversationResult` --references--> `Message`  [EXTRACTED]
  src/hooks/useConversation.ts → src/types/conversation.ts

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.05
Nodes (41): @emotion/react, @emotion/styled, @mui/icons-material, @mui/material, devDependencies, @emotion/react, @emotion/styled, @mui/icons-material (+33 more)

### Community 1 - "ui/index.ts"
Cohesion: 0.11
Nodes (27): useProviderReadiness(), UseProviderReadinessResult, ProviderKey, ProviderReadiness, AISQLToolbar(), AISQLToolbarProps, ChartPreview(), ChartPreviewProps (+19 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (36): dependencies, mermaid, react-markdown, recharts, rehype-highlight, remark-gfm, description, engines (+28 more)

### Community 3 - "AISQLChatBody.tsx"
Cohesion: 0.13
Nodes (19): ConversationOutcome, AIProvider, serializeAIOutput(), serializeResult(), AISQLChatBody(), AISQLChatBodyProps, HistoryOutcomeAlert(), HistoryOutcomeAlertProps (+11 more)

### Community 4 - "AISQLChat.tsx"
Cohesion: 0.10
Nodes (32): drainSSE(), SSE_EVENTS, SSECloseReason, reduce(), useAISQL(), useAISQLChatSession(), UseAISQLChatSessionParams, UseAISQLChatSessionResult (+24 more)

### Community 5 - "events.ts"
Cohesion: 0.10
Nodes (26): AISQLState, CompletedTurn, empty, ReducerAction, TimelineStep, CompleteEvent, ContentChunkEvent, ErrorEvent (+18 more)

### Community 6 - "ResultsDisplay.tsx"
Cohesion: 0.20
Nodes (13): loadMermaid(), MermaidView(), MermaidViewProps, stripFences(), parseChart(), ResultsDisplay(), ResultsDisplayProps, fmtMoney() (+5 more)

### Community 7 - "conversation.ts"
Cohesion: 0.16
Nodes (18): Message, MessageRole, ChatMessage(), ChatMessageProps, HistoryMessage(), HistoryMessageProps, serializeMessage(), serializeResult() (+10 more)

### Community 8 - "compilerOptions"
Cohesion: 0.09
Nodes (21): node_modules, src, compilerOptions, allowSyntheticDefaultImports, declaration, declarationDir, emitDeclarationOnly, esModuleInterop (+13 more)

### Community 9 - "useNewSessionDraft.ts"
Cohesion: 0.26
Nodes (9): ConversationRow, UseNewSessionDraftResult, ConversationItem(), ConversationItemProps, shortDate(), ConversationList(), ConversationListProps, ConversationSidebar() (+1 more)

### Community 10 - "schema.ts"
Cohesion: 0.15
Nodes (23): ChartHint, ColumnDef, DBSchema, ResultFormat, TableDef, axisStyle(), BAR_CHART_MARGIN, CHART_MARGIN (+15 more)

### Community 11 - "@sd/ai-sql"
Cohesion: 0.40
Nodes (4): Install, @sd/ai-sql, Subpath exports, Use

## Knowledge Gaps
- **87 isolated node(s):** `name`, `version`, `description`, `type`, `node` (+82 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `QueryResult` connect `events.ts` to `schema.ts`, `AISQLChatBody.tsx`, `ResultsDisplay.tsx`, `conversation.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `TokenUsage` connect `events.ts` to `ui/index.ts`, `AISQLChat.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _87 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05365853658536585 - nodes in this community are weakly interconnected._
- **Should `ui/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11382113821138211 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._