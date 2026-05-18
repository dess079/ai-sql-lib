# @sd/ai-sql

Drop-in React 19 + MUI v7 components for AI-powered SQL chat with streaming SSE.

## Install

```bash
pnpm add @sd/ai-sql
```

Pair with [`ai-sql-spring-boot-starter`](../ai-sql-spring-boot-starter) on the backend.

## Use

```tsx
import { AISQLChat } from "@sd/ai-sql/ui";

export default function App() {
  return <AISQLChat backendUrl="http://localhost:4000" userId="default" />;
}
```

## Subpath exports

| Import | Contents |
|---|---|
| `@sd/ai-sql` | TypeScript types (SSE events, models, schema) |
| `@sd/ai-sql/ui` | React components (`AISQLChat`, `ProcessTimeline`, …) |
| `@sd/ai-sql/hooks` | React hooks (`useAISQL`, `useSSEStream`, …) |
