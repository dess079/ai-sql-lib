/**
 * Public UI API for `@sd/ai-sql/ui`.
 * Le rendu (prompt, réponses, conversations) est délégué à shared-components ;
 * cette lib ne conserve que l'orchestration AI-SQL.
 */
export { AISQLChat } from "./AISQLChat";
export type { AISQLChatProps } from "./AISQLChat";
export { toAiChatMessage, toAiQueryResult } from "./aiMapping";
export { ModelSelector } from "./ModelSelector";
export type { ModelSelectorProps } from "./ModelSelector";
export { TokenUsageBar } from "./TokenUsageBar";
export type { TokenUsageBarProps } from "./TokenUsageBar";
export { AISQLToolbar } from "./AISQLToolbar";
export type { AISQLToolbarProps } from "./AISQLToolbar";
export { ProviderStatusBar } from "./ProviderStatusBar";
export type { ProviderStatusBarProps } from "./ProviderStatusBar";
export { ProviderStatusBadge } from "./ProviderStatusBadge";
export type { ProviderStatusBadgeProps } from "./ProviderStatusBadge";
export { SchemaViewer } from "./SchemaViewer";
export { ExamplePromptsButton } from "./example-prompts";
export type { ExamplePromptsButtonProps } from "./example-prompts";
export { ExamplePromptsPanel } from "./example-prompts";
export type { ExamplePromptsPanelProps } from "./example-prompts";
export { EXAMPLE_GROUPS } from "./example-prompts";
export type { ExamplePrompt, ExampleGroup, OutputType } from "./example-prompts";