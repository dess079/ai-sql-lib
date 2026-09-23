# Graph Report - ai-sql-lib  (2026-09-21)

## Corpus Check
- 62 files · ~19,074 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 341 nodes · 708 edges · 15 communities (14 shown, 1 thin omitted)
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
- events.ts
- AISQLChat.tsx
- models.ts
- AISQLChatBody.tsx
- MermaidView.tsx
- compilerOptions
- conversation.ts
- ChartView.tsx
- @sd/ai-sql
- rollup.config.js
- schema.ts

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
- `CompletedTurn` --references--> `QueryResult`  [EXTRACTED]
  src/hooks/useAISQL.ts → src/types/schema.ts
- `AISQLState` --references--> `TokenUsage`  [EXTRACTED]
  src/hooks/useAISQL.ts → src/types/models.ts
- `AISQLState` --references--> `QueryResult`  [EXTRACTED]
  src/hooks/useAISQL.ts → src/types/schema.ts
- `UseAISQLChatSessionParams` --references--> `Conversation`  [EXTRACTED]
  src/hooks/useAISQLChatSession.ts → src/types/conversation.ts
- `UseConversationResult` --references--> `Message`  [EXTRACTED]
  src/hooks/useConversation.ts → src/types/conversation.ts

## Import Cycles
- None detected.

## Communities (15 total, 1 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.05
Nodes (41): @emotion/react, @emotion/styled, @mui/icons-material, @mui/material, devDependencies, @emotion/react, @emotion/styled, @mui/icons-material (+33 more)

### Community 1 - "ui/index.ts"
Cohesion: 0.12
Nodes (26): useProviderReadiness(), MessageRole, AISQLChatProps, AISQLToolbar(), AISQLToolbarProps, ChatMessage(), ChatMessageProps, ChartPreview() (+18 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (36): dependencies, mermaid, react-markdown, recharts, rehype-highlight, remark-gfm, description, engines (+28 more)

### Community 3 - "events.ts"
Cohesion: 0.10
Nodes (23): empty, reduce(), ReducerAction, TimelineStep, CompleteEvent, ContentChunkEvent, ErrorEvent, EventOf (+15 more)

### Community 4 - "AISQLChat.tsx"
Cohesion: 0.12
Nodes (27): drainSSE(), SSE_EVENTS, SSECloseReason, useAISQL(), useAISQLChatSession(), UseAISQLChatSessionParams, UseAISQLChatSessionResult, useConversation() (+19 more)

### Community 5 - "models.ts"
Cohesion: 0.24
Nodes (10): UseModelsResult, UseProviderReadinessResult, AIModel, AIProvider, ProviderKey, ProviderReadiness, ctxLabel(), ModelSelector() (+2 more)

### Community 6 - "AISQLChatBody.tsx"
Cohesion: 0.17
Nodes (13): AISQLState, serializeAIOutput(), serializeResult(), AISQLChatBody(), AISQLChatBodyProps, MessageHeaderChips(), MessageHeaderChipsProps, ResponseMetaChips() (+5 more)

### Community 7 - "MermaidView.tsx"
Cohesion: 0.36
Nodes (7): DiagramArea(), loadMermaid(), MermaidView(), MermaidViewProps, renderSvg(), stripFences(), useZoomPan()

### Community 8 - "compilerOptions"
Cohesion: 0.09
Nodes (21): node_modules, src, compilerOptions, allowSyntheticDefaultImports, declaration, declarationDir, emitDeclarationOnly, esModuleInterop (+13 more)

### Community 9 - "conversation.ts"
Cohesion: 0.16
Nodes (14): UseConversationResult, UseConversationSelectionParams, UseConversationSelectionResult, UseLastConversationSelectionParams, ConversationRow, UseNewSessionDraftResult, Conversation, ConversationItem() (+6 more)

### Community 10 - "ChartView.tsx"
Cohesion: 0.23
Nodes (17): ChartHint, axisStyle(), BAR_CHART_MARGIN, CHART_MARGIN, gridProps(), legendStyle(), pal(), PALETTE() (+9 more)

### Community 11 - "@sd/ai-sql"
Cohesion: 0.40
Nodes (4): Install, @sd/ai-sql, Subpath exports, Use

### Community 14 - "schema.ts"
Cohesion: 0.08
Nodes (34): CompletedTurn, Message, QueryResultEvent, ColumnDef, DBSchema, QueryResult, ResultFormat, TableDef (+26 more)

## Knowledge Gaps
- **87 isolated node(s):** `name`, `version`, `description`, `type`, `node` (+82 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `QueryResult` connect `schema.ts` to `conversation.ts`, `events.ts`, `AISQLChatBody.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `TokenUsage` connect `events.ts` to `ui/index.ts`, `AISQLChat.tsx`, `models.ts`, `AISQLChatBody.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _87 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05365853658536585 - nodes in this community are weakly interconnected._
- **Should `ui/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12462462462462462 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._