/**
 * Lazy mermaid renderer. Loads the mermaid library on demand to keep
 * the initial bundle small.
 */
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

/** Props for {@link MermaidView}. */
export interface MermaidViewProps {
  code: string;
}

let mermaidPromise: Promise<typeof import("mermaid")> | null = null;
const loadMermaid = (): Promise<typeof import("mermaid")> => {
  if (!mermaidPromise) mermaidPromise = import("mermaid");
  return mermaidPromise;
};

/**
 * Renders a Mermaid diagram from raw mermaid source code.
 * @param props.code - the mermaid graph definition
 * @returns the rendered SVG (or a spinner while loading)
 */
export function MermaidView({ code }: MermaidViewProps): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadMermaid().then((mod) => {
      if (cancelled || !ref.current) return;
      const id = `mmd-${Math.random().toString(36).slice(2)}`;
      mod.default.initialize({ startOnLoad: false, theme: "default", securityLevel: "strict" });
      mod.default.render(id, code).then(({ svg }) => {
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        setReady(true);
      }).catch((e: Error) => {
        if (ref.current) ref.current.innerHTML = `<pre style="color:red">${e.message}</pre>`;
        setReady(true);
      });
    });
    return () => { cancelled = true; };
  }, [code]);

  return (
    <Box sx={{ my: 1, p: 1, bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 1, overflow: "auto" }}>
      {!ready && <CircularProgress size={20} />}
      <div ref={ref} />
    </Box>
  );
}
