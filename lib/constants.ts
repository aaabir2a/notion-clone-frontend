export const APP_NAME = "Notion Clone";
export const APP_DESCRIPTION = "Collaborative workspace for your team";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  WORKSPACE: (id: string) => `/workspace/${id}`,
  PAGE: (id: string) => `/page/${id}`,
} as const;

export const BLOCK_TYPES = [
  { type: "TEXT", label: "Text", icon: "Type" },
  { type: "HEADING_1", label: "Heading 1", icon: "Heading1" },
  { type: "HEADING_2", label: "Heading 2", icon: "Heading2" },
  { type: "HEADING_3", label: "Heading 3", icon: "Heading3" },
  { type: "BULLET_LIST", label: "Bullet List", icon: "List" },
  { type: "NUMBERED_LIST", label: "Numbered List", icon: "ListOrdered" },
  { type: "TODO", label: "To-do", icon: "CheckSquare" },
  { type: "TOGGLE", label: "Toggle", icon: "ChevronRight" },
  { type: "QUOTE", label: "Quote", icon: "Quote" },
  { type: "DIVIDER", label: "Divider", icon: "Minus" },
  { type: "CODE", label: "Code", icon: "Code" },
  { type: "IMAGE", label: "Image", icon: "Image" },
  { type: "CALLOUT", label: "Callout", icon: "MessageSquare" },
] as const;

export const KEYBOARD_SHORTCUTS = {
  SAVE: "Ctrl+S",
  BOLD: "Ctrl+B",
  ITALIC: "Ctrl+I",
  UNDERLINE: "Ctrl+U",
  NEW_PAGE: "Ctrl+N",
  SEARCH: "Ctrl+K",
} as const;

