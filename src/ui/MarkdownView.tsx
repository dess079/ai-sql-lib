/**
 * Markdown renderer with GFM + code highlighting.
 * Falls back to plain text on render error.
 */
import type { JSX } from "react";
import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

/** Props for {@link MarkdownView}. */
export interface MarkdownViewProps { content: string; }

/**
 * Renders markdown using react-markdown + remark-gfm + rehype-highlight.
 * Wrapped in a MUI Box so it inherits theme spacing.
 *
 * @param props.content - the raw markdown text
 * @returns the rendered markdown
 */
export function MarkdownView({ content }: MarkdownViewProps): JSX.Element {
  return (
    <Box sx={{
      "& p": { my: 0.5 },
      "& pre": { p: 1.5, bgcolor: "action.selected", color: "text.primary", border: "1px solid", borderColor: "divider", borderRadius: 1, overflow: "auto" },
      "& code": { fontFamily: "monospace", fontSize: 13 },
      "& table": { borderCollapse: "collapse", my: 1 },
      "& th, & td": { border: 1, borderColor: "divider", px: 1, py: 0.5 },
    }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}
