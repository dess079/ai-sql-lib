# Graph Report - ai-sql-lib  (2026-09-23)

## Corpus Check
- 39 files · ~10,297 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 244 nodes · 445 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
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
- compilerOptions
- @sd/ai-sql
- rollup.config.js
- schema.ts

## God Nodes (most connected - your core abstractions)
1. `AISQLChat()` - 17 edges
2. `compilerOptions` - 16 edges
3. `TokenUsage` - 12 edges
4. `Conversation` - 11 edges
5. `QueryResult` - 9 edges
6. `Message` - 7 edges
7. `AISQLEvent` - 7 edges
8. `parseModelReference()` - 7 edges
9. `scripts` - 6 edges
10. `ExamplePromptsPanel()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `useSSEStream()` --calls--> `drainSSE()`  [EXTRACTED]
  src/hooks/useSSEStream.ts → src/hooks/sseUtils.ts
- `CompletedTurn` --references--> `QueryResult`  [EXTRACTED]
  src/hooks/useAISQL.ts → src/types/schema.ts
- `UseAISQLChatSessionParams` --references--> `AISQLEvent`  [EXTRACTED]
  src/hooks/useAISQLChatSession.ts → src/types/events.ts
- `UseConversationSelectionParams` --references--> `Conversation`  [EXTRACTED]
  src/hooks/useConversationSelection.ts → src/types/conversation.ts
- `UseLastConversationSelectionParams` --references--> `Conversation`  [EXTRACTED]
  src/hooks/useLastConversationSelection.ts → src/types/conversation.ts

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.05
Nodes (41): @emotion/react, @emotion/styled, @mui/icons-material, @mui/material, devDependencies, @emotion/react, @emotion/styled, @mui/icons-material (+33 more)

### Community 1 - "ui/index.ts"
Cohesion: 0.15
Nodes (22): useProviderReadiness(), UseProviderReadinessResult, ProviderReadiness, AISQLChatProps, AISQLToolbar(), AISQLToolbarProps, ChartPreview(), ChartPreviewProps (+14 more)

### Community 2 - "package.json"
Cohesion: 0.05
Nodes (36): mermaid, dependencies, mermaid, react-markdown, recharts, rehype-highlight, remark-gfm, description (+28 more)

### Community 3 - "events.ts"
Cohesion: 0.09
Nodes (30): drainSSE(), SSE_EVENTS, SSECloseReason, AISQLState, CompletedTurn, empty, reduce(), ReducerAction (+22 more)

### Community 4 - "AISQLChat.tsx"
Cohesion: 0.11
Nodes (31): useAISQL(), useAISQLChatSession(), UseAISQLChatSessionParams, UseAISQLChatSessionResult, useConversation(), UseConversationResult, ConversationOutcome, useConversationOutcome() (+23 more)

### Community 5 - "models.ts"
Cohesion: 0.23
Nodes (11): UseModelsResult, AIModel, AIProvider, ProviderKey, ctxLabel(), ModelSelector(), ModelSelectorProps, TokenUsageBar() (+3 more)

### Community 8 - "compilerOptions"
Cohesion: 0.09
Nodes (21): node_modules, src, compilerOptions, allowSyntheticDefaultImports, declaration, declarationDir, emitDeclarationOnly, esModuleInterop (+13 more)

### Community 11 - "@sd/ai-sql"
Cohesion: 0.40
Nodes (4): Install, @sd/ai-sql, Subpath exports, Use

### Community 14 - "schema.ts"
Cohesion: 0.25
Nodes (7): ChartHint, ColumnDef, DBSchema, ResultFormat, TableDef, SchemaViewer(), SchemaViewerProps

## Knowledge Gaps
- **85 isolated node(s):** `name`, `version`, `description`, `type`, `node` (+80 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `peerDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05365853658536585 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `events.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08912655971479501 - nodes in this community are weakly interconnected._
- **Should `AISQLChat.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10808080808080808 - nodes in this community are weakly interconnected._