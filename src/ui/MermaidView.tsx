/**
 * Lazy mermaid renderer. Loads the mermaid library on demand to keep
 * the initial bundle small.
 */
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/** Props for {@link MermaidView}. */
export interface MermaidViewProps {
  code: string;
}

let mermaidPromise: Promise<typeof import("mermaid")> | null = null;

/**
 * Loads mermaid once and initialises it on first load.
 * Re-initialising too often can reset the parser and cause syntax errors.
 */
const loadMermaid = (): Promise<typeof import("mermaid")> => {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid");
  }

  return mermaidPromise;
};

/** Strips optional ```mermaid … ``` code fences that the AI sometimes wraps diagrams in. */
function stripFences(code: string): string {
  return code.replace(/^```(?:mermaid)?\s*/i, "").replace(/\s*```$/, "").trim();
}

/**
 * Renders a Mermaid diagram from raw mermaid source code.
 * @param props.code - the mermaid graph definition
 * @returns the rendered SVG (or a spinner while loading)
 */
export function MermaidView({ code }: MermaidViewProps): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    let cancelled = false;
    const clean = stripFences(code);

    loadMermaid().then((mod) => {
      if (cancelled || !ref.current) return;
      const id = `mmd-${Math.random().toString(36).slice(2)}`;

      mod.default.initialize({
        startOnLoad: false,
        theme: theme.palette.mode === "dark" ? "dark" : "default",
        themeVariables: {
          background: theme.palette.background.paper,
          primaryColor: theme.palette.primary.main,
          secondaryColor: theme.palette.secondary.main,
          tertiaryColor: theme.palette.text.secondary,
          textColor: theme.palette.text.primary,
          lineColor: theme.palette.divider,
          border1: theme.palette.divider,
          noteBkgColor: theme.palette.background.default,
          noteTextColor: theme.palette.text.primary,
        },
      });

      mod.default.render(id, clean).then(({ svg }) => {
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        setReady(true);
      }).catch((e: Error) => {
        if (ref.current) ref.current.innerHTML = `<pre style="color:red">${e.message}</pre>`;
        setReady(true);
      });
    });

    return () => { cancelled = true; };
  }, [code, theme.palette.mode, theme.palette.background.paper, theme.palette.primary.main, theme.palette.secondary.main, theme.palette.text.primary, theme.palette.text.secondary, theme.palette.divider]);

  return (
    <Box sx={{ my: 1, p: 1, bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1, overflow: "auto" }}>
      {!ready && <CircularProgress size={20} />}
      <div ref={ref} />
    </Box>
  );
}
