/**
 * Sidebar list of past conversations with "New Session" button.
 */
import type { JSX } from "react";
import { List, Box, Typography, Skeleton, Button, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ConversationItem } from "./ConversationItem";
import type { Conversation } from "../types/conversation";

/** Props for {@link ConversationList}. */
export interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  /** Called when the user confirms an inline rename. */
  onRename: (id: string, title: string) => void;
  /** Called when the user clicks "New Session". */
  onNewSession: () => void;
  /** Opens the session detail dialog for the given conversation. */
  onDetail: (id: string) => void;
}

/**
 * Vertical list of conversations with delete/rename affordances and a "New Session" button.
 *
 * @param props.conversations - the conversation array
 * @param props.loading       - show skeletons while loading
 * @param props.activeId      - currently selected conversation id
 * @param props.onSelect      - callback when a row is clicked
 * @param props.onDelete      - callback when the trash icon is clicked
 * @param props.onRename      - callback when a rename is confirmed
 * @param props.onNewSession  - callback to start a fresh conversation
 * @param props.onDetail      - opens session detail dialog for a conversation
 * @returns the list JSX
 */
export function ConversationList({ conversations, loading, activeId, onSelect, onDelete, onRename, onNewSession, onDetail }: ConversationListProps): JSX.Element {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 1.5, minHeight: 64, display: "flex", alignItems: "center", borderBottom: 1, borderColor: "divider" }}>
        <Button fullWidth variant="contained" size="small" startIcon={<AddIcon />} onClick={onNewSession}
          sx={{ textTransform: "none", fontWeight: 600 }}>
          New Session
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ px: 1.5, pt: 1 }}>
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={56} sx={{ my: 0.75, borderRadius: 1 }} />)}
        </Box>
      ) : conversations.length === 0 ? (
        <Typography variant="body2" sx={{ p: 2, color: "text.secondary", textAlign: "center" }}>
          No conversations yet.
        </Typography>
      ) : (
        <List disablePadding sx={{ overflow: "auto", flex: 1 }}>
          {conversations.map((c, idx) => (
            <Box key={c.id}>
              <ConversationItem conversation={c} active={c.id === activeId}
                onSelect={() => onSelect(c.id)} onDelete={() => onDelete(c.id)}
                onRename={(title) => onRename(c.id, title)}
                onDetail={() => onDetail(c.id)} />
              {idx < conversations.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}

