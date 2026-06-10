/**
 * Single conversation row with inline rename support and contextual menu.
 */
import type { JSX } from "react";
import { useState } from "react";
import { Box, IconButton, ListItemIcon, Menu, MenuItem, TextField, Typography, Avatar } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import type { Conversation } from "../types/conversation";

/** Props for {@link ConversationItem}. */
export interface ConversationItemProps {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  /** Called when the user confirms a new title. */
  onRename: (title: string) => void;
  /** Opens the session detail dialog for this conversation. */
  onDetail: () => void;
}

/** Formats a date string as a short locale date. */
function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Conversation row with a ⋮ contextual menu (Details / Rename / Delete).
 *
 * @param props.conversation - the conversation data
 * @param props.active       - whether this row is selected
 * @param props.onSelect     - called when the row is clicked
 * @param props.onDelete     - called when delete is chosen
 * @param props.onRename     - called with the new title on confirm
 * @param props.onDetail     - opens the session detail dialog
 * @returns the row JSX
 */
export function ConversationItem({ conversation: c, active, onSelect, onDelete, onRename, onDetail }: ConversationItemProps): JSX.Element {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(c.title);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => { e.stopPropagation(); setAnchor(e.currentTarget); };
  const closeMenu = () => setAnchor(null);

  const startEdit = () => { closeMenu(); setDraft(c.title); setEditing(true); };
  const commit = () => { if (draft.trim()) onRename(draft.trim()); setEditing(false); };
  const cancel = () => { setDraft(c.title); setEditing(false); };

  if (editing) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", px: 1.5, py: 1 }}>
        <TextField size="small" value={draft} autoFocus fullWidth
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
          sx={{ mr: 0.5 }} />
        <IconButton size="small" onClick={commit} aria-label="Confirm rename"><CheckIcon fontSize="small" /></IconButton>
        <IconButton size="small" onClick={cancel} aria-label="Cancel rename"><CloseIcon fontSize="small" /></IconButton>
      </Box>
    );
  }

  return (
    <>
      <Box onClick={onSelect} sx={{
        display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25, cursor: "pointer",
        bgcolor: active ? "action.selected" : "transparent",
        borderLeft: active ? 3 : 3, borderColor: active ? "primary.main" : "transparent",
        "&:hover": { bgcolor: active ? "action.selected" : "action.hover" },
        transition: "background-color 0.15s",
      }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: active ? "primary.main" : "action.disabledBackground",
          color: active ? "primary.contrastText" : "text.secondary", flexShrink: 0 }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={active ? 600 : 400} noWrap>{c.title}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {c.model ?? "—"} · {shortDate(c.updatedAt)}
          </Typography>
        </Box>

        <IconButton size="small" onClick={openMenu} aria-label={`Options ${c.title}`}
          sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu}
        slotProps={{ paper: { sx: { minWidth: 160 } } }}>
        <MenuItem onClick={() => { closeMenu(); onDetail(); }}>
          <ListItemIcon><InfoOutlinedIcon fontSize="small" /></ListItemIcon>Détails
        </MenuItem>
        <MenuItem onClick={startEdit}>
          <ListItemIcon><EditOutlinedIcon fontSize="small" /></ListItemIcon>Renommer
        </MenuItem>
        <MenuItem onClick={() => { closeMenu(); onDelete(); }} sx={{ color: "error.main" }}>
          <ListItemIcon><DeleteOutlineIcon fontSize="small" color="error" /></ListItemIcon>Supprimer
        </MenuItem>
      </Menu>
    </>
  );
}

