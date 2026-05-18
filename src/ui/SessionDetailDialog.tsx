/**
 * Full-transcript dialog for a conversation session.
 * Displays every persisted message (user prompt + assistant reply + optional SQL).
 */
import type { JSX } from "react";
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Box, Typography, CircularProgress, Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PdfExportProvider, PdfExportButton } from "shared-components";
import type { Message } from "../types/conversation";
import { MessageRow } from "./MessageRow";

/** Props for {@link SessionDetailDialog}. */
export interface SessionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  messages: Message[];
  loading: boolean;
}

/**
 * Scrollable dialog that renders the full saved transcript of a conversation.
 *
 * @param props.open     - controlled open state
 * @param props.onClose  - close handler
 * @param props.title    - conversation title shown in the dialog header
 * @param props.messages - list of persisted messages
 * @param props.loading  - show spinner while fetching
 * @returns the dialog JSX
 */
export function SessionDetailDialog({ open, onClose, title, messages, loading }: SessionDetailDialogProps): JSX.Element {
  let currentQuery = 0;

  const numberedMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => {
      if (m.role === "user") currentQuery += 1;

      return { ...m, queryNumber: currentQuery || 1 };
    });

  return (
    <PdfExportProvider>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        scroll="paper"
        slotProps={{ paper: { sx: { maxHeight: "90vh", display: "flex", flexDirection: "column" } } }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1.5, gap: 1 }}>
            <Typography variant="h6" component="span" sx={{ flex: 1, fontWeight: 600 }} noWrap>
              {title || "Session details"}
            </Typography>
            <PdfExportButton title={title || "Session"} tooltip="Exporter en PDF" />
            <IconButton size="small" onClick={onClose} aria-label="Close">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          )}
          {!loading && numberedMessages.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No messages yet.
            </Typography>
          )}
          {!loading && numberedMessages.map((m, i) => (
            <Box key={m.id}>
              {(i === 0 || numberedMessages[i - 1].queryNumber !== m.queryNumber) && (
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Query #{m.queryNumber}
                </Typography>
              )}

              {i > 0 && <Divider sx={{ my: 1 }} />}
              <MessageRow message={m} queryNumber={m.queryNumber} />
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </PdfExportProvider>
  );
}
